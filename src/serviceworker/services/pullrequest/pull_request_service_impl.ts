import { inject, injectable } from "tsyringe";
import {
  PullRequest,
  PullRequestGroupResult,
  PullRequestSummary,
} from "../../../api/pull_request_summary";
import {
  LocalStorageService,
  LOCAL_STORAGE_SERVICE,
} from "../localstorage/local_storage_service";
import { PullRequestService } from "./pull_request_service";

@injectable()
export class PullRequestServiceImpl implements PullRequestService {
  constructor(
    @inject(LOCAL_STORAGE_SERVICE)
    private readonly localStorageService: LocalStorageService
  ) {}

  /** @override */
  readonly fetchPullRequestSummary = (): Promise<PullRequestSummary> => {
    const queries = [
      // Open drafts
      ["is:open", "is:pr", "draft:true", "author:@me", "archived:false"],
      // PRs ready to submit
      ["is:open", "is:pr", "author:@me", "review:approved", "archived:false"],
      // PRs ready to review
      ["is:open", "is:pr", "review-requested:@me"],
      // My PRs waiting on others
      ["is:open", "is:pr", "draft:false", "author:@me", "review:required"],
    ];

    const queryPromises = queries.map((query) => this.queryPullRequests(query));

    return Promise.allSettled(queryPromises)
      .then(([drafts, readyToReview, readyToSubmit, waitingForOthers]) => ({
        drafts: toPullRequestGroup(drafts),
        readyToReview: toPullRequestGroup(readyToReview),
        readyToSubmit: toPullRequestGroup(readyToSubmit),
        waitingForOthers: toPullRequestGroup(waitingForOthers),
      }))
      .then((summary) => {
        this.localStorageService.set("pullRequestSummary", summary);
        return summary;
      });
  };

  private queryPullRequests(
    queryPararms: readonly string[]
  ): Promise<ReadonlyArray<PullRequest>> {
    const q = encodeURIComponent(queryPararms.join(" "));

    return this.localStorageService
      .get("githubAccessToken")
      .then((accessToken) =>
        fetch(`https://api.github.com/search/issues?q=${q}`, {
          method: "GET",
          credentials: "same-origin",
          headers: new Headers({
            Authorization: `token ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
          }),
        })
      )
      .then((response) => response.json() as Promise<SearchResponse>)
      .then((body) => {
        return body.items.map((item) => ({
          kind: "PullRequest",
          url: item.html_url,
        }));
      });
  }
}

const toPullRequestGroup = (
  result: PromiseSettledResult<ReadonlyArray<PullRequest>>
): PullRequestGroupResult => {
  if (result.status === "rejected") {
    return {
      kind: "PullRequestGroupFetchError",
      errors: [result.reason],
    };
  }

  return {
    kind: "PullRequestGroup",
    fetchedAtEpochMillis: new Date().getTime(),
    pullRequests: result.value,
  };
};

interface SearchItem {
  readonly html_url: string;
}

interface SearchResponse {
  readonly incomplete_results: boolean;
  readonly items: readonly SearchItem[];
}
