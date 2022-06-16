import { container, DependencyContainer } from "tsyringe";

import "./services/badge/badge_registry";
import "../common/services/localstorage/local_storage_registry";
import "./services/pullrequest/pull_request_registry";
import "./services/runtimemessage/runtime_message_registry";

export const getServiceContainer = (): DependencyContainer => container;
