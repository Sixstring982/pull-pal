import { Lifecycle, registry } from "tsyringe";
import { ON_FIVE_MINUTE_ALARM } from "../../events/on_five_minute_alarm";
import { FetchPullRequestsAlarm } from "./fetch_pull_requestst_alarm";
import { PULL_REQUEST_SERVICE } from "./pull_request_service";
import { PullRequestServiceImpl } from "./pull_request_service_impl";

@registry([
  // PullRequestService
  {
    token: PULL_REQUEST_SERVICE,
    useClass: PullRequestServiceImpl,
    options: { lifecycle: Lifecycle.Singleton },
  },
  // FetchPullRequestsAlarm
  {
    token: ON_FIVE_MINUTE_ALARM,
    useClass: FetchPullRequestsAlarm,
    options: { lifecycle: Lifecycle.Singleton },
  },
])
export class PullRequestRegistry {}
