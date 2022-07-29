import React from "react";
import moment from "moment";

import { PullRequest } from "../../../api/api";
import { mapStyles } from "../../../common/util/styles";

import styleMap from "./pull_request_view.scss";
const styles = mapStyles(styleMap);

export const PULL_REQUEST_VIEW_FLAGS = ["show-author", "show-age"] as const;

export type PullRequestViewFlag = typeof PULL_REQUEST_VIEW_FLAGS[number];

export interface PullRequestViewProps {
  readonly pullRequest: PullRequest;
  readonly options?: ReadonlySet<PullRequestViewFlag>;
}

export const PullRequestView = (props: PullRequestViewProps) => {
  const options = props.options ?? new Set();
  const authorLine = (() => {
    if (!options.has("show-author")) {
      return undefined;
    }
    return (
      <div>
        Author:
        <a
          href={props.pullRequest.authorUrl}
          rel="noopener norefferer"
          target="_blank"
        >
          {props.pullRequest.authorUsername}
        </a>
      </div>
    );
  })();

  const ageLine = (() => {
    if (!options.has("show-age")) {
      return undefined;
    }

    const date = moment(props.pullRequest.createdEpochMillis);

    return (
      <div className={styles("age-indicator")} title={date.toString()}>
        Created {date.fromNow()}
      </div>
    );
  })();

  return (
    <div className={styles("pull-request-view-wrapper")}>
      {authorLine}
      {ageLine}
      <h3>
        <a
          href={props.pullRequest.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          {props.pullRequest.title}
        </a>
      </h3>
    </div>
  );
};
