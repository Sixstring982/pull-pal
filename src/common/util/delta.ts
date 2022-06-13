export interface Delta<T> {
  readonly oldValue?: T;
  readonly newValue?: T;
}
