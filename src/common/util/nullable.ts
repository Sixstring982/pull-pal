export const mapUndefinable = <A, B>(
  a: A | undefined,
  fn: (_: A) => B
): B | undefined => {
  if (a === undefined) {
    return undefined;
  }
  return fn(a);
};

export const toList = <A>(a: A | undefined): readonly A[] => {
  if (a === undefined) {
    return [];
  }
  return [a];
};
