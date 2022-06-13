export type NonEmptyArray<T> = [T, ...T[]];

export const isNonEmpty = <T>(ts: readonly T[]): ts is NonEmptyArray<T> =>
  ts.length > 0;

export const isEmpty = <T>(ts: readonly T[]): ts is NonEmptyArray<T> =>
  ts.length === 0;
