import { container, DependencyContainer } from "tsyringe";

import "./services/runtimemessage/runtime_message_registry";
import "./services/pullrequest/pull_request_registry";
import "./services/localstorage/local_storage_registry";

export const getServiceContainer = (): DependencyContainer => container;
