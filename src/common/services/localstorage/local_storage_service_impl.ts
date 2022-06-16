import { BehaviorSubject, filter, map, Observable } from "rxjs";
import { injectable } from "tsyringe";
import { OnStorageChange } from "../../events/on_storage_change";
import { Delta } from "../../util/delta";
import {
  DEFAULT_LOCAL_STORAGE_SCHEMA,
  LocalStorageSchema,
} from "./local_storage_schema";
import { LocalStorageService } from "./local_storage_service";

@injectable()
export class LocalStorageServiceImpl
  implements LocalStorageService, OnStorageChange
{
  private readonly storageChangeSubject = new BehaviorSubject<{
    [K in keyof LocalStorageSchema]?: Delta<LocalStorageSchema[K]>;
  }>({});

  /** @override */
  handleStorageChange(
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: "sync" | "local" | "managed" | "session"
  ): void {
    if (areaName !== "local") {
      return;
    }

    this.storageChangeSubject.next(changes);
  }

  /** @override */
  set<K extends keyof LocalStorageSchema>(
    key: K,
    value: LocalStorageSchema[K]
  ): Promise<void> {
    return chrome.storage.local.set({ [key]: value });
  }

  /** @override */
  get<K extends keyof LocalStorageSchema>(
    key: K
  ): Promise<LocalStorageSchema[K]> {
    return chrome.storage.local.get(key).then((value) => value[key]);
  }

  /** @override */
  getUpdate$<K extends keyof LocalStorageSchema>(
    key: K
  ): Observable<LocalStorageSchema[K]> {
    return this.storageChangeSubject
      .pipe(
        filter((changes) => changes[key]?.newValue !== changes[key]?.oldValue)
      )
      .pipe(map((schema) => schema[key]?.newValue));
  }
}
