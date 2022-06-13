import { InjectionToken } from "tsyringe";

export const ON_RUNTIME_MESSAGE: InjectionToken<OnRuntimeMessage> =
  Symbol("OnRuntimeMessage");

export interface OnRuntimeMessage {
  handleMessage(
    message: unknown,
    sender: chrome.runtime.MessageSender,
    sendResponse: (_: unknown) => void
  ): void;
}
