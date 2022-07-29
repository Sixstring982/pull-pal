import { BehaviorSubject, Observable } from "rxjs";
import { inject, injectable } from "tsyringe";
import {
  GetPullRequestSummaryRequest,
  GetPullRequestSummaryResponse,
  getPullRequestSummaryResponseSchema,
} from "../../../api/api";
import {
  DEFAULT_PULL_REQUEST_SUMMARY,
  PullRequestSummary,
} from "../../../api/api";
import {
  LocalStorageService,
  LOCAL_STORAGE_SERVICE,
} from "../../../common/services/localstorage/local_storage_service";
import { RuntimeRequestService } from "./runtime_request_service";

@injectable()
export class RuntimeRequestServiceImpl implements RuntimeRequestService {
  private readonly pullRequestSummarySubject =
    new BehaviorSubject<PullRequestSummary>(DEFAULT_PULL_REQUEST_SUMMARY);

  constructor(
    @inject(LOCAL_STORAGE_SERVICE) localStorageService: LocalStorageService
  ) {
    this.refreshPullRequestSummary();

    localStorageService.getUpdate$("githubAccessToken").subscribe(() => {
      this.refreshPullRequestSummary();
    });
  }

  /** @override */
  getPullRequestSummary$(): Observable<PullRequestSummary> {
    return this.pullRequestSummarySubject.asObservable();
  }

  /** @override */
  refreshPullRequestSummary(): Promise<void> {
    const message: GetPullRequestSummaryRequest = {
      kind: "GetPullRequestSummaryRequest",
    };

    return chrome.runtime
      .sendMessage(message)
      .then(getPullRequestSummaryResponseSchema.safeParseAsync)
      .then((parseResult) => {
        if (!parseResult.success) {
          throw parseResult.error;
        }

        this.pullRequestSummarySubject.next(
          parseResult.data.pullRequestSummary
        );
      });
  }
}
