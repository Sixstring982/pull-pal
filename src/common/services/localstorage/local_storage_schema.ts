import { PullRequestSummary } from "../../../api/api";
import { Delta } from "../../util/delta";

export interface LocalStorageSchema {
  readonly pullRequestSummary?: Delta<PullRequestSummary>;
  readonly githubAccessToken?: string;
}

export const DEFAULT_LOCAL_STORAGE_SCHEMA: LocalStorageSchema = {
  pullRequestSummary: {},
  githubAccessToken: "",
};
