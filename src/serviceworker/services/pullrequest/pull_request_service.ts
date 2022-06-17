import { Observable } from "rxjs";
import { InjectionToken } from "tsyringe";
import { PullRequestSummary } from "../../../api/pull_request_summary";
import { Delta } from "../../../common/util/delta";

export const PULL_REQUEST_SERVICE: InjectionToken<PullRequestService> =
  Symbol("PullRequestService");

export interface PullRequestService {
  /**
   * Gets an {@link Observable} over changes to each {@link PullRequestSummary}
   */
  getPullRequestSummary$(): Observable<Delta<PullRequestSummary>>;

  getPullRequestSummary(): PullRequestSummary;

  fetchPullRequestSummary(): Promise<Delta<PullRequestSummary>>;
}
