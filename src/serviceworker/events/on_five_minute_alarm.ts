import { InjectionToken } from "tsyringe";

export const ON_FIVE_MINUTE_ALARM: InjectionToken<OnFiveMinuteAlarm> =
  Symbol("OnFiveMinuteAlarm");

/**
 * Each implementor of this interface will receive an event periodically, once
 * every five minutes.
 */
export interface OnFiveMinuteAlarm {
  /** Called once every five minutes. */
  handleAlarm(alarm: chrome.alarms.Alarm): void;
}
