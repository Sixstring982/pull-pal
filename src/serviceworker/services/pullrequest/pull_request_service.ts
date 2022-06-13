import { InjectionToken } from "tsyringe";
import { PullRequestSummary } from "../../../api/pull_request_summary";

export const PULL_REQUEST_SERVICE: InjectionToken<PullRequestService> =
  Symbol("PullRequestService");

export interface PullRequestService {
  fetchPullRequestSummary(): Promise<PullRequestSummary>;
}
