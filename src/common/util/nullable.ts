export const mapUndefinable = <A, B>(
  a: A | undefined,
  fn: (_: A) => B
): B | undefined => {
  if (a === undefined) {
    return undefined;
  }
  return fn(a);
};
