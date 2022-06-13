import { Lifecycle, registry } from "tsyringe";
import { ON_RUNTIME_MESSAGE } from "../../events/on_runtime_message";
import { RuntimeMessageHandler } from "./runtime_message_handler";

@registry([{
  token: ON_RUNTIME_MESSAGE,
  useClass: RuntimeMessageHandler,
  options: {lifecycle: Lifecycle.Singleton}
}])
export class RuntimeMessageRegistry { }