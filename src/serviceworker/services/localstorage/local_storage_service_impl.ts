import { BehaviorSubject, filter, map, Observable } from "rxjs";
import { injectable } from "tsyringe";
import { Delta } from "../../../common/util/delta";
import {
  DEFAULT_LOCAL_STORAGE_SCHEMA,
  LocalStorageSchema,
} from "./local_storage_schema";
import { LocalStorageService } from "./local_storage_service";

@injectable()
export class LocalStorageServiceImpl implements LocalStorageService {
  private schemaDeltaSubject = new BehaviorSubject<Delta<LocalStorageSchema>>(
    {}
  );

  constructor() {
    chrome.storage.local.get(null, (schema: LocalStorageSchema) => {
      this.schemaDeltaSubject.next({
        oldValue: this.schemaDeltaSubject.value.newValue,
        newValue: schema,
      });
    });
  }

  /** @override */
  set<K extends keyof LocalStorageSchema>(
    key: K,
    value: LocalStorageSchema[K]
  ): Promise<void> {
    return chrome.storage.local.set({ [key]: value }).then(() => {
      const oldValue = this.schemaDeltaSubject.value.newValue;
      const newValue = { ...oldValue, [key]: value };
      this.schemaDeltaSubject.next({ oldValue, newValue });
    });
  }

  /** @override */
  get<K extends keyof LocalStorageSchema>(
    key: K
  ): Promise<LocalStorageSchema[K]> {
    return chrome.storage.local
      .get(key)
      .then((value) => value[key] ?? DEFAULT_LOCAL_STORAGE_SCHEMA[key]);
  }

  /** @override */
  getUpdate$<K extends keyof LocalStorageSchema>(
    key: K
  ): Observable<LocalStorageSchema[K]> {
    return this.schemaDeltaSubject
      .pipe(
        filter(
          (schema) =>
            (schema.oldValue ?? {})[key] !== (schema.newValue ?? {})[key]
        )
      )
      .pipe(map((schema) => (schema.newValue ?? {})[key]));
  }
}
