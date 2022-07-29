import { Observable } from "rxjs";
import { InjectionToken } from "tsyringe";
import { PullRequestSummary } from "../../../api/api";

export const RUNTIME_REQUEST_SERVICE: InjectionToken<RuntimeRequestService> =
  Symbol("RuntimeRequestService");

export interface RuntimeRequestService {
  getPullRequestSummary$(): Observable<PullRequestSummary>;

  refreshPullRequestSummary(): Promise<void>;
}
