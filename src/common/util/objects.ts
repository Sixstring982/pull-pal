export const hasProperty = <K extends PropertyKey>(x: object, key: K): x is Record<K, unknown> => 
  key in x;