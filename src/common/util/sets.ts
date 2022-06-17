export const difference = <A>(
  a1: ReadonlySet<A>,
  a2: ReadonlySet<A>
): ReadonlySet<A> => new Set([...a1].filter((a) => !a2.has(a)));

export const equal = <A>(a1: ReadonlySet<A>, a2: ReadonlySet<A>): boolean =>
  [...a1].every((a) => a2.has(a)) && a1.size === a2.size;
