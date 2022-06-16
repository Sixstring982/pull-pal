import { inject, injectable } from "tsyringe";
import {
  GetPullRequestSummaryRequest,
  GetPullRequestSummaryResponse,
  isGetPullRequestSummaryRequest,
} from "../../../api/api";
import { DEFAULT_PULL_REQUEST_SUMMARY } from "../../../api/pull_request_summary";
import { OnRuntimeMessage } from "../../events/on_runtime_message";
import {
  LocalStorageService,
  LOCAL_STORAGE_SERVICE,
} from "../../../common/services/localstorage/local_storage_service";
import {
  PullRequestService,
  PULL_REQUEST_SERVICE,
} from "../pullrequest/pull_request_service";

@injectable()
export class RuntimeMessageHandler implements OnRuntimeMessage {
  constructor(
    @inject(PULL_REQUEST_SERVICE)
    private readonly pullRequestService: PullRequestService,
    @inject(LOCAL_STORAGE_SERVICE)
    private readonly localStorageService: LocalStorageService
  ) {}

  handleMessage(
    message: unknown,
    sender: chrome.runtime.MessageSender,
    sendResponse: (_: unknown) => void
  ): void {
    const responsePromise = (() => {
      if (isGetPullRequestSummaryRequest(message)) {
        return this.handleGetPullRequestSummaryRequest(message);
      }
      return Promise.resolve(undefined);
    })();

    responsePromise.then((response) => {
      sendResponse(response);
    });
  }

  private handleGetPullRequestSummaryRequest(
    request: GetPullRequestSummaryRequest
  ): Promise<GetPullRequestSummaryResponse> {
    return this.pullRequestService
      .fetchPullRequestSummary()
      .then((pullRequestSummary) => ({
        kind: "GetPullRequestSummaryResponse",
        pullRequestSummary,
      }));
  }
}
