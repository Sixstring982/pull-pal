export const ENVIRONMENTS = ["development", "production"] as const;

export type Environment = typeof ENVIRONMENTS[number];

export const ENVIRONMENT_SET: ReadonlySet<Environment> = new Set(ENVIRONMENTS);

export const isEnvironment = (x: string): x is Environment =>
  ENVIRONMENT_SET.has(x as Environment);
