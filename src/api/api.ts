import { hasProperty } from "../common/util/objects";
import { PullRequestSummary } from "./pull_request_summary";

export interface GetPullRequestSummaryRequest {
  readonly kind: "GetPullRequestSummaryRequest";
}
export const isGetPullRequestSummaryRequest = (
  x: unknown
): x is GetPullRequestSummaryRequest => {
  if (typeof x !== "object" || x === null || !hasProperty(x, "kind")) {
    return false;
  }

  return x.kind === "GetPullRequestSummaryRequest";
};

export interface GetPullRequestSummaryResponse {
  readonly kind: "GetPullRequestSummaryResponse";
  readonly pullRequestSummary: PullRequestSummary;
}
