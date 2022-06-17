import { ON_STORAGE_CHANGE } from "../common/events/on_storage_change";
import { ON_NOTIFICATION_CLICK } from "./events/on_notification_click";
import { ON_ONE_MINUTE_ALARM } from "./events/on_one_minute_alarm";
import { ON_RUNTIME_MESSAGE } from "./events/on_runtime_message";
import { ENSURE_CONSTRUCTRED } from "./services/ensure_constructed";
import { getServiceContainer } from "./service_container";

export const libMain = () => {
  ////// Ensure constructed
  getServiceContainer().resolveAll(ENSURE_CONSTRUCTRED);

  ////// Alarms
  // Register all alarms
  chrome.alarms.create("1-minute", {
    delayInMinutes: 0,
    periodInMinutes: 1,
  });
  // Alarm listeners
  chrome.alarms.onAlarm.addListener((e) => {
    if (e.name === "1-minute") {
      getServiceContainer()
        .resolveAll(ON_ONE_MINUTE_ALARM)
        .forEach((handler) => {
          handler.handleAlarm(e);
        });
    }
  });

  ////// Runtime messages
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    getServiceContainer()
      .resolveAll(ON_RUNTIME_MESSAGE)
      .forEach((handler) => {
        handler.handleMessage(message, sender, sendResponse);
      });

    // Indicate to the runtime that we'll send a response asynchronously.
    return true;
  });

  ////// Local storage events
  chrome.storage.onChanged.addListener((changes, areaName) => {
    getServiceContainer()
      .resolveAll(ON_STORAGE_CHANGE)
      .forEach((handler) => {
        handler.handleStorageChange(changes, areaName);
      });
  });

  ////// Chrome notification events
  chrome.notifications.onClicked.addListener((id) => {
    getServiceContainer()
      .resolveAll(ON_NOTIFICATION_CLICK)
      .forEach((handler) => {
        handler.handleClick(id);
      });
  });
};
