import { container, DependencyContainer } from "tsyringe";

import './runtimerequest/runtime_request_registry';

export const getServiceContainer = (): DependencyContainer => container;
