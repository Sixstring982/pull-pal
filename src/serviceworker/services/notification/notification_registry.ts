import { Lifecycle, registry } from "tsyringe";
import { ON_NOTIFICATION_CLICK } from "../../events/on_notification_click";
import { ENSURE_CONSTRUCTRED } from "../ensure_constructed";
import {
  ChromeNotificationService,
  CHROME_NOTIFICATION_SERVICE,
} from "./chrome_notification_service";

@registry([
  {
    token: CHROME_NOTIFICATION_SERVICE,
    useClass: ChromeNotificationService,
    options: { lifecycle: Lifecycle.Singleton },
  },
  {
    token: ENSURE_CONSTRUCTRED,
    useToken: CHROME_NOTIFICATION_SERVICE,
  },
  {
    token: ON_NOTIFICATION_CLICK,
    useToken: CHROME_NOTIFICATION_SERVICE,
  },
])
export class NotificationRegistry {}
