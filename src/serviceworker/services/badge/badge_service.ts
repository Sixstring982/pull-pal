import { inject, injectable } from "tsyringe";
import {
  PullRequestGroup,
  PullRequestGroupResult,
  PullRequestSummary,
} from "../../../api/pull_request_summary";
import {
  PullRequestService,
  PULL_REQUEST_SERVICE,
} from "../pullrequest/pull_request_service";

interface BadgeState {
  readonly color: string;
  readonly text: string;
}

@injectable()
export class BadgeService {
  constructor(
    @inject(PULL_REQUEST_SERVICE) pullRequestService: PullRequestService
  ) {
    pullRequestService.getPullRequestSummary$().subscribe((summary) => {
      const state = computeState(summary);

      chrome.action.setBadgeBackgroundColor({
        color: state.color,
      });
      chrome.action.setBadgeText({
        text: state.text,
      });
    });
  }
}

const computeState = (summary: PullRequestSummary): BadgeState => {
  if (
    Object.values(summary).some(
      (x: PullRequestGroupResult) =>
        x.kind === "PullRequestGroupFetchBadCredentials"
    )
  ) {
    return { color: "black", text: "!!!" };
  }

  let count;
  if ((count = countPullRequestsInGroup(summary.readyToReview)) > 0) {
    return {
      color: "red",
      text: String(count),
    };
  }

  if ((count = countPullRequestsInGroup(summary.readyToSubmit)) > 0) {
    return {
      color: "green",
      text: String(count),
    };
  }

  if ((count = countPullRequestsInGroup(summary.waitingForOthers)) > 0) {
    return {
      color: "yellow",
      text: String(count),
    };
  }

  return { color: "black", text: "" };
};

const countPullRequestsInGroup = (group: PullRequestGroupResult): number => {
  switch (group.kind) {
    case "PullRequestGroup":
      return group.pullRequests.length;
    case "PullRequestGroupFetchError": // Fall through
    case "PullRequestGroupFetchBadCredentials": // Fall through
    case "PullRequestGroupNotYetFetched":
      return 0;
  }
};
