import { useEffect, useState } from "react";
import { Observable } from "rxjs";

export function useObservable<T>(
  observable: Observable<T>,
  defaultValue?: T
): T;
export function useObservable<T>(observable: Observable<T>): T | undefined {
  const [currentState, setState] = useState<T | undefined>(undefined);

  useEffect(() => {
    const subscription = observable.subscribe((state) => {
      setState(state);
    });

    return () => {
      subscription.unsubscribe();
    };
  });

  return currentState;
}
