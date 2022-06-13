import { InjectionToken } from "tsyringe";

export const ON_ONE_MINUTE_ALARM: InjectionToken<OnOneMinuteAlarm> =
  Symbol("OnOneMinuteAlarm");

export interface OnOneMinuteAlarm {
  handleAlarm(alarm: chrome.alarms.Alarm): void;
}
