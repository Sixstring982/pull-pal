import * as Esbuild from "esbuild";
import { OnResolveResult } from "esbuild";
import fs from "fs";
import fse from "fs-extra";
import path from "path";
import { argv, exit } from "process";
import { pnpPlugin } from "@yarnpkg/esbuild-plugin-pnp";
import { ENVIRONMENTS, isEnvironment } from "./src/common/environment";

const BUILD_DIR = path.join(__dirname, "dist");
const SRC_DIR = path.join(__dirname, "src");
const STATIC_DIR = path.join(__dirname, "static");

const ENVIRONMENT = (() => {
  const envArg = argv.find((x) => x.startsWith("--environment="));
  if (envArg === undefined) {
    console.error(
      "Expected environment flag to be specified! " +
        "Environment argument must be specified as, eg: " +
        '"--environment=development',
      { argv }
    );
    exit(1);
  }

  const env = envArg.substring("--environment=".length);

  if (!isEnvironment(env)) {
    console.error("Specified environment flag is not a valid environment!", {
      environmentFlag: env,
      validEnvironments: ENVIRONMENTS,
    });
    exit(1);
  }

  return env;
})();

// Clean out old builds
if (fs.existsSync(BUILD_DIR)) {
  fs.rmSync(BUILD_DIR, { recursive: true, force: true });
}

// Copy static files
fse.copySync(STATIC_DIR, BUILD_DIR);

if (argv.includes("--watch")) {
  console.log("Starting build in watch mode...");
}

const patchedResolvedPath = (
  modulePath: string,
  resolvedPath: string
): string => {
  if (modulePath === "tslib") {
    return resolvedPath.replace("/modules/index.js", "/tslib.es6.js");
  }
  return resolvedPath;
};

type OnResolveParams = {
  resolvedPath: string | null;
  watchFiles: Array<string>;
  error?: Error;
};

const defaultOnResolve = async (
  args: Esbuild.OnResolveArgs,
  { resolvedPath, error, watchFiles }: OnResolveParams
): Promise<OnResolveResult> => {
  const problems = error ? [{ text: error.message }] : [];

  // Sometimes dynamic resolve calls might be wrapped in a try / catch,
  // but ESBuild neither skips them nor does it provide a way for us to tell.
  // Because of that, we downgrade all errors to warnings in these situations.
  // Issue: https://github.com/evanw/esbuild/issues/1127
  let mergeWith;
  switch (args.kind) {
    case `require-call`:
    case `require-resolve`:
    case `dynamic-import`:
      {
        mergeWith = { warnings: problems };
      }
      break;

    default:
      {
        mergeWith = { errors: problems };
      }
      break;
  }

  if (resolvedPath !== null) {
    return {
      namespace: `pnp`,
      path: patchedResolvedPath(args.path, resolvedPath),
      watchFiles,
    };
  } else {
    return { external: true, ...mergeWith, watchFiles };
  }
};

const commonEsbuildOptions = (projectName: string): Esbuild.BuildOptions => ({
  bundle: true,
  minify: ENVIRONMENT === "production",
  sourcemap: ENVIRONMENT === "production" ? undefined : "inline",
  plugins: [
    pnpPlugin({
      onResolve: defaultOnResolve,
    }),
  ],
  watch: !argv.includes("--watch")
    ? undefined
    : {
        onRebuild(error: Esbuild.BuildFailure | null) {
          if (error) {
            console.log(error);
          } else {
            console.log(`${projectName} build complete.`);
          }
        },
      },
});

// Build the popup script
Esbuild.build({
  entryPoints: [path.join(SRC_DIR, "popup", "main.ts")],
  outfile: path.join(BUILD_DIR, "popup.js"),
  ...commonEsbuildOptions('Popup'),
})
  .then(() => {
    console.log("Popup build complete.");
  })
  .catch((error) => {
    console.error(error);
  });

// Build the service worker script
Esbuild.build({
  entryPoints: [path.join(SRC_DIR, "serviceworker", "main.ts")],
  outfile: path.join(BUILD_DIR, "service_worker.js"),
  ...commonEsbuildOptions('Service worker'),
})
  .then(() => {
    console.log("Service worker build complete.");
  })
  .catch((error) => {
    console.error(error);
  });
