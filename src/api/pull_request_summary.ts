import { NonEmptyArray } from "../common/util/non_empty";

export interface PullRequest {
  readonly kind: "PullRequest";
}

//
// #region PullRequestGroupResult
//

export interface PullRequestGroupNotYetFetched {
  readonly kind: "PullRequestGroupNotYetFetched";
}
export const PULL_REQUEST_GROUP_NOT_YET_FETCHED: PullRequestGroupNotYetFetched =
  {
    kind: "PullRequestGroupNotYetFetched",
  };

export interface PullRequestGroupFetchError {
  readonly kind: "PullRequestGroupFetchError";
  readonly errors: NonEmptyArray<string>;
}

export interface PullRequestGroup {
  readonly kind: "PullRequestGroup";
  readonly fetchedAt: Date;
  readonly pullRequests: readonly PullRequest[];
}

export type PullRequestGroupResult =
  | PullRequestGroupNotYetFetched
  | PullRequestGroupFetchError
  | PullRequestGroup;

//
// #endregion PullRequestGroupResult
//

export interface PullRequestSummary {
  readonly drafts: PullRequestGroupResult;
  readonly readyToSubmit: PullRequestGroupResult;
  readonly readyToReview: PullRequestGroupResult;
  readonly waitingForOthers: PullRequestGroupResult;
}

export const DEFAULT_PULL_REQUEST_SUMMARY: PullRequestSummary = {
  drafts: PULL_REQUEST_GROUP_NOT_YET_FETCHED,
  readyToSubmit: PULL_REQUEST_GROUP_NOT_YET_FETCHED,
  readyToReview: PULL_REQUEST_GROUP_NOT_YET_FETCHED,
  waitingForOthers: PULL_REQUEST_GROUP_NOT_YET_FETCHED,
};
