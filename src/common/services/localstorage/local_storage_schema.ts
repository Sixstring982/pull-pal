import {
  DEFAULT_PULL_REQUEST_SUMMARY,
  PullRequestSummary,
} from "../../../api/pull_request_summary";

export interface LocalStorageSchema {
  readonly pullRequestSummary?: PullRequestSummary;
  readonly githubAccessToken?: string;
}

export const DEFAULT_LOCAL_STORAGE_SCHEMA: LocalStorageSchema = {
  pullRequestSummary: DEFAULT_PULL_REQUEST_SUMMARY,
  githubAccessToken: "",
};
