import { InjectionToken } from "tsyringe";

export const ON_NOTIFICATION_CLICK: InjectionToken<OnNotificationClick> =
  Symbol("OnNotificationClick");

export interface OnNotificationClick {
  readonly handleClick: Parameters<
    typeof chrome.notifications.onClicked.addListener
  >[0];
}
