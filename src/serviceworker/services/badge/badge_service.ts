import { inject, injectable } from "tsyringe";
import { PullRequestGroupResult } from "../../../api/pull_request_summary";
import {
  PullRequestService,
  PULL_REQUEST_SERVICE,
} from "../pullrequest/pull_request_service";

@injectable()
export class BadgeService {
  constructor(
    @inject(PULL_REQUEST_SERVICE)
    private readonly pullRequestService: PullRequestService
  ) {
    pullRequestService.getPullRequestSummary$().subscribe((summary) => {
      let count;
      if ((count = countPullRequestsInGroup(summary.readyToReview)) > 0) {
        chrome.action.setBadgeBackgroundColor({
          color: "red",
        });
        chrome.action.setBadgeText({
          text: String(count),
        });
        return;
      }

      if ((count = countPullRequestsInGroup(summary.readyToSubmit)) > 0) {
        chrome.action.setBadgeBackgroundColor({
          color: "green",
        });
        chrome.action.setBadgeText({
          text: String(count),
        });
        return;
      }

      if ((count = countPullRequestsInGroup(summary.waitingForOthers)) > 0) {
        chrome.action.setBadgeBackgroundColor({
          color: "yellow",
        });
        chrome.action.setBadgeText({
          text: String(count),
        });
        return;
      }

      chrome.action.setBadgeText({
        text: "",
      });
    });
  }
}

const countPullRequestsInGroup = (group: PullRequestGroupResult): number => {
  switch (group.kind) {
    case "PullRequestGroup":
      return group.pullRequests.length;
    case "PullRequestGroupFetchError": // Fall through
    case "PullRequestGroupNotYetFetched":
      return 0;
  }
};
