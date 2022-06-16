import { Lifecycle, registry } from "tsyringe";
import { ON_STORAGE_CHANGE } from "../../events/on_storage_change";
import { LOCAL_STORAGE_SERVICE } from "./local_storage_service";
import { LocalStorageServiceImpl } from "./local_storage_service_impl";

@registry([
  {
    token: LOCAL_STORAGE_SERVICE,
    useClass: LocalStorageServiceImpl,
    options: { lifecycle: Lifecycle.Singleton },
  },
  {
    token: ON_STORAGE_CHANGE,
    useToken: LOCAL_STORAGE_SERVICE,
  },
])
export class LocalStorageRegistry {}
