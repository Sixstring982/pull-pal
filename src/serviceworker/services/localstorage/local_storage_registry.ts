import { Lifecycle, registry } from "tsyringe";
import { LOCAL_STORAGE_SERVICE } from "./local_storage_service";
import { LocalStorageServiceImpl } from "./local_storage_service_impl";

@registry([
  {
    token: LOCAL_STORAGE_SERVICE,
    useClass: LocalStorageServiceImpl,
    options: { lifecycle: Lifecycle.Singleton },
  },
])
export class LocalStorageRegistry {}
