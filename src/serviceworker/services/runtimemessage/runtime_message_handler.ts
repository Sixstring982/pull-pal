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
} from "../localstorage/local_storage_service";

@injectable()
export class RuntimeMessageHandler implements OnRuntimeMessage {
  constructor(
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
    return this.localStorageService
      .get("pullRequestSummary")
      .then((summary) => ({
        kind: "GetPullRequestSummaryResponse",
        pullRequestSummary: summary ?? DEFAULT_PULL_REQUEST_SUMMARY,
      }));
  }
}
