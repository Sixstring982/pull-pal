import { container, DependencyContainer } from "tsyringe";

import "./runtimerequest/runtime_request_registry";
import "../../common/services/localstorage/local_storage_registry";

export const getServiceContainer = (): DependencyContainer => container;
