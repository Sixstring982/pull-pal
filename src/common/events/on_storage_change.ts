import { InjectionToken } from "tsyringe";

export const ON_STORAGE_CHANGE: InjectionToken<OnStorageChange> =
  Symbol("OnStorageChange");

export interface OnStorageChange {
  readonly handleStorageChange: Parameters<
    typeof chrome.storage.onChanged.addListener
  >[0];
}
