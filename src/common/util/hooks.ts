import { useEffect, useState } from "react";
import { Observable } from "rxjs";

export const useObservable = <T>(observable: Observable<T>): T | undefined => {
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
};
