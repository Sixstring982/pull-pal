import { inject, injectable } from "tsyringe";
import { OnOneMinuteAlarm } from "../../events/on_one_minute_alarm";
import {
  PullRequestService,
  PULL_REQUEST_SERVICE,
} from "./pull_request_service";

@injectable()
export class FetchPullRequestsAlarm implements OnOneMinuteAlarm {
  constructor(
    @inject(PULL_REQUEST_SERVICE)
    private readonly pullRequestService: PullRequestService
  ) {}

  /** @override */
  readonly handleAlarm = (): void => {
    this.pullRequestService.fetchPullRequestSummary();
  };
}
