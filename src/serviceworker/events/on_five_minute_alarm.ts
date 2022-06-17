import { InjectionToken } from "tsyringe";

export const ON_FIVE_MINUTE_ALARM: InjectionToken<OnFiveMinuteAlarm> =
  Symbol("OnFiveMinuteAlarm");

export interface OnFiveMinuteAlarm {
  handleAlarm(alarm: chrome.alarms.Alarm): void;
}
