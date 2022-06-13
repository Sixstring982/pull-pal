import { BehaviorSubject, Observable } from "rxjs";
import {
  GetPullRequestSummaryRequest,
  GetPullRequestSummaryResponse,
} from "../../../api/api";
import {
  DEFAULT_PULL_REQUEST_SUMMARY,
  PullRequestSummary,
} from "../../../api/pull_request_summary";
import { RuntimeRequestService } from "./runtime_request_service";

export class RuntimeRequestServiceImpl implements RuntimeRequestService {
  private readonly pullRequestSummarySubject =
    new BehaviorSubject<PullRequestSummary>(DEFAULT_PULL_REQUEST_SUMMARY);

  /** @override */
  getPullRequestSummary$(): Observable<PullRequestSummary> {
    return this.pullRequestSummarySubject.asObservable();
  }

  /** @override */
  refreshPullRequestSummary(): Promise<void> {
    const message: GetPullRequestSummaryRequest = {
      kind: "GetPullRequestSummaryRequest",
    };

    return chrome.runtime
      .sendMessage(message)
      .then((response: GetPullRequestSummaryResponse) => {
        this.pullRequestSummarySubject.next(response.pullRequestSummary);
      });
  }
}
