import { Lifecycle, registry } from "tsyringe";
import { RUNTIME_REQUEST_SERVICE } from "./runtime_request_service";
import { RuntimeRequestServiceImpl } from "./runtime_request_service_impl";

@registry([
  {
    token: RUNTIME_REQUEST_SERVICE,
    useClass: RuntimeRequestServiceImpl,
    options: { lifecycle: Lifecycle.Singleton },
  },
])
export class RuntimeRequestRegistry {}
