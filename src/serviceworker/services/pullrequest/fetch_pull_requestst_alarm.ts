import { inject, injectable } from "tsyringe";
import { OnFiveMinuteAlarm } from "../../events/on_five_minute_alarm";
import {
  PullRequestService,
  PULL_REQUEST_SERVICE,
} from "./pull_request_service";

@injectable()
export class FetchPullRequestsAlarm implements OnFiveMinuteAlarm {
  constructor(
    @inject(PULL_REQUEST_SERVICE)
    private readonly pullRequestService: PullRequestService
  ) {}

  /** @override */
  readonly handleAlarm = (): void => {
    this.pullRequestService.fetchPullRequestSummary();
  };
}
