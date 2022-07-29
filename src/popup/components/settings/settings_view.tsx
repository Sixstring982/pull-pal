import React, { FormEvent } from "react";
import { LOCAL_STORAGE_SERVICE } from "../../../common/services/localstorage/local_storage_service";
import { mapStyles } from "../../../common/util/styles";
import { getServiceContainer } from "../../services/service_container";

import styleMap from "./settings_view.scss";
const styles = mapStyles(styleMap);

export const SettingsView = () => {
  return <AccessTokenForm />;
};

const AccessTokenForm = () => {
  const tokenInputRef = React.createRef<HTMLInputElement>();
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const token = tokenInputRef.current?.value;
    getServiceContainer()
      .resolve(LOCAL_STORAGE_SERVICE)
      .set("githubAccessToken", token);

    // Don't reload the page on submit.
    return false;
  };

  return (
    <>
      <form className={styles("card")} onSubmit={handleSubmit}>
        <h1> GitHub access token </h1>
        <details className={styles("callout")}>
          <summary>What's this?</summary>
          This token is required in order to auth with GitHub. Follow{" "}
          <a
            href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token"
            rel="noopener noreferrer"
          >
            these instructions
          </a>{" "}
          to create one.
          <p>
            You'll need to scope your access token to include <b>repo</b> access
            - the one which is labeled{" "}
            <i>Full control of private repositories</i>. Pull Pal may not work
            properly if you use different permissions.
          </p>
          <p>For security reasons, this field is write-only.</p>
          <p>
            This token is stored as plaintext in local storage - someone with
            access to your machine could read this token via the Chrome
            devtools. If you're concerned about this, some options are:
          </p>
          <ul>
            <li>Configure your access token to expire quickly</li>
            <li>Clear your access token by setting an empty one here</li>
          </ul>
        </details>
        <input ref={tokenInputRef} type="password" />
        <input type="submit" />
      </form>
    </>
  );
};
