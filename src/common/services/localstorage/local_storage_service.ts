import { Observable } from "rxjs";
import { InjectionToken } from "tsyringe";
import { LocalStorageSchema } from "./local_storage_schema";

export const LOCAL_STORAGE_SERVICE: InjectionToken<LocalStorageService> =
  Symbol("LocalStorageService");

export interface LocalStorageService {
  get<K extends keyof LocalStorageSchema>(
    key: K
  ): Promise<LocalStorageSchema[K]>;

  set<K extends keyof LocalStorageSchema>(
    key: K,
    value: LocalStorageSchema[K]
  ): Promise<void>;

  /** @override */
  getUpdate$<K extends keyof LocalStorageSchema>(
    key: K
  ): Observable<LocalStorageSchema[K]>;
}
