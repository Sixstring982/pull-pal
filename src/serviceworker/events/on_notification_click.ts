import { InjectionToken } from "tsyringe";

export const ON_NOTIFICATION_CLICK: InjectionToken<OnNotificationClick> =
  Symbol("OnNotificationClick");

/**
 * Each implementor of this interface will receive an event whenever a Chrome
 * notification has been clicked.
 */
export interface OnNotificationClick {
  /** Called whenever a Chrome notification has been clicked. */
  readonly handleClick: Parameters<
    typeof chrome.notifications.onClicked.addListener
  >[0];
}
