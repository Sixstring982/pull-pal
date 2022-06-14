import { BehaviorSubject, Observable } from "rxjs";
import { inject, injectable } from "tsyringe";
import {
  DEFAULT_PULL_REQUEST_SUMMARY,
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
  private readonly pullRequestSummarySubject =
    new BehaviorSubject<PullRequestSummary>(DEFAULT_PULL_REQUEST_SUMMARY);

  constructor(
    @inject(LOCAL_STORAGE_SERVICE)
    private readonly localStorageService: LocalStorageService
  ) {}

  getPullRequestSummary$(): Observable<PullRequestSummary> {
    return this.pullRequestSummarySubject.asObservable();
  }

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
      .then(([drafts, readyToSubmit, readyToReview, waitingForOthers]) => ({
        drafts: toPullRequestGroup(drafts),
        readyToSubmit: toPullRequestGroup(readyToSubmit),
        readyToReview: toPullRequestGroup(readyToReview),
        waitingForOthers: toPullRequestGroup(waitingForOthers),
      }))
      .then((summary) => {
        this.localStorageService.set("pullRequestSummary", summary);
        this.pullRequestSummarySubject.next(summary);
        return summary;
      });
  };

  private queryPullRequests(
    queryPararms: readonly string[]
  ): Promise<SearchResponse> {
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
          .then((response) => response.json() as Promise<SearchResponse>)
          .then((x) => {
            console.log(x);
            return x;
          })
      );
  }
}

const toPullRequestGroup = (
  result: PromiseSettledResult<SearchResponse>
): PullRequestGroupResult => {
  if (result.status === "rejected") {
    return {
      kind: "PullRequestGroupFetchError",
      errors: [result.reason],
    };
  }

  if (isSearchResponseBadCredentials(result.value)) {
    return {
      kind: "PullRequestGroupFetchError",
      errors: ["Bad credentials."],
    };
  }

  return {
    kind: "PullRequestGroup",
    fetchedAtEpochMillis: new Date().getTime(),
    pullRequests: result.value.items.map((item) => ({
      kind: "PullRequest",
      id: item.id,
      url: item.html_url,
      title: item.title,
    })),
  };
};

interface SearchItem {
  readonly id: number;
  readonly html_url: string;
  readonly title: string;
}

interface SearchResponseSuccess {
  readonly incomplete_results: boolean;
  readonly items: readonly SearchItem[];
}

interface SearchResponseBadCredentials {
  readonly message: "Bad credentials";
  readonly documentation_url: string;
}
const isSearchResponseBadCredentials = (
  x: SearchResponse
): x is SearchResponseBadCredentials =>
  "message" in x && x.message === "Bad credentials";

type SearchResponse = SearchResponseSuccess | SearchResponseBadCredentials;
