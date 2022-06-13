import { Observable } from "rxjs";
import { InjectionToken } from "tsyringe";
import { PullRequestSummary } from "../../../api/pull_request_summary";

export const PULL_REQUEST_SERVICE: InjectionToken<PullRequestService> =
  Symbol("PullRequestService");

export interface PullRequestService {
  getPullRequestSummary$(): Observable<PullRequestSummary>;

  fetchPullRequestSummary(): Promise<PullRequestSummary>;
}
