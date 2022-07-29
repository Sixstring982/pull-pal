import { inject, injectable } from "tsyringe";
import {
  GetPullRequestSummaryRequest,
  GetPullRequestSummaryResponse,
} from "../../../api/api";
import { DEFAULT_PULL_REQUEST_SUMMARY } from "../../../api/api";
import { getPullRequestSummaryRequestSchema } from "../../../api/api";
import { OnRuntimeMessage } from "../../events/on_runtime_message";
import {
  PullRequestService,
  PULL_REQUEST_SERVICE,
} from "../pullrequest/pull_request_service";

@injectable()
export class RuntimeMessageHandler implements OnRuntimeMessage {
  constructor(
    @inject(PULL_REQUEST_SERVICE)
    private readonly pullRequestService: PullRequestService
  ) {}

  handleMessage(
    message: unknown,
    _: chrome.runtime.MessageSender,
    sendResponse: (_: unknown) => void
  ): void {
    const responsePromise = (() => {
      const pullRequestSummary =
        getPullRequestSummaryRequestSchema.safeParse(message);
      if (pullRequestSummary.success) {
        return this.handleGetPullRequestSummaryRequest();
      }
      return Promise.resolve(undefined);
    })();

    responsePromise.then((response) => {
      sendResponse(response);
    });
  }

  private handleGetPullRequestSummaryRequest(): Promise<GetPullRequestSummaryResponse> {
    return this.pullRequestService.fetchPullRequestSummary().then((delta) => ({
      kind: "GetPullRequestSummaryResponse",
      pullRequestSummary: delta.newValue ?? DEFAULT_PULL_REQUEST_SUMMARY,
    }));
  }
}
