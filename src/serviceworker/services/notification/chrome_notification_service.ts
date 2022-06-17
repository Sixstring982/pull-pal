import { inject, injectable, InjectionToken } from "tsyringe";
import * as Sets from "../../../common/util/sets";
import {
  DEFAULT_PULL_REQUEST_SUMMARY,
  PullRequest,
  PullRequestSummary,
} from "../../../api/pull_request_summary";
import {
  PullRequestService,
  PULL_REQUEST_SERVICE,
} from "../pullrequest/pull_request_service";
import { OnNotificationClick } from "../../events/on_notification_click";
import {
  LocalStorageService,
  LOCAL_STORAGE_SERVICE,
} from "../../../common/services/localstorage/local_storage_service";
import { PullRequestServiceImpl } from "../pullrequest/pull_request_service_impl";

export const CHROME_NOTIFICATION_SERVICE: InjectionToken<ChromeNotificationService> =
  Symbol("ChromeNotificationService");

@injectable()
export class ChromeNotificationService implements OnNotificationClick {
  constructor(
    @inject(PULL_REQUEST_SERVICE)
    private readonly pullRequestService: PullRequestService
  ) {
    pullRequestService.getPullRequestSummary$().subscribe((delta) => {
      const oldReviewIds = getRequestedReviewIds(
        delta.oldValue ?? DEFAULT_PULL_REQUEST_SUMMARY
      );
      const newReviewIds = getRequestedReviewIds(
        delta.newValue ?? DEFAULT_PULL_REQUEST_SUMMARY
      );
      const reviewIdsToNotify = Sets.difference(newReviewIds, oldReviewIds);

      if (reviewIdsToNotify.size > 0) {
        const reviews = (() => {
          if (delta.newValue?.readyToReview.kind !== "PullRequestGroup") {
            throw new Error("Illegal state! Reviews must be present.");
          }

          return delta.newValue.readyToReview.pullRequests.filter((pr) =>
            reviewIdsToNotify.has(pr.id)
          );
        })();

        reviews.forEach((pr) => {
          this.showNotificationForReview(pr);
        });
      }
    });
  }

  /** @override */
  readonly handleClick = (notificationId: string): void => {
    const { readyToReview } = this.pullRequestService.getPullRequestSummary();
    if (readyToReview.kind !== "PullRequestGroup") {
      return;
    }

    const pr = readyToReview.pullRequests.find(
      (x) => String(x.id) === notificationId
    );
    if (pr === undefined) {
      return;
    }

    window.open(pr.url, "_blank", "noopener,noreferrer");
  };

  private showNotificationForReview(pr: PullRequest): void {
    chrome.notifications.create(String(pr.id), {
      title: "PR Review requested",
      message: `Author: ${pr.authorUsername}\n` + `Title: ${pr.title}`,
      iconUrl:
        "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      type: "basic",
    });
  }
}

const getRequestedReviewIds = (
  summary: PullRequestSummary
): ReadonlySet<number> => {
  if (summary.readyToReview.kind !== "PullRequestGroup") {
    return new Set([]);
  }

  return new Set(summary.readyToReview.pullRequests.map((x) => x.id));
};
