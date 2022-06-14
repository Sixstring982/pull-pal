import React from "react";
import { PullRequest } from "../../../api/pull_request_summary";
import { mapStyles } from "../../../common/util/styles";

import styleMap from "./pull_request_view.scss";
const styles = mapStyles(styleMap);

export interface PullRequestViewProps {
  readonly pullRequest: PullRequest;
}

export const PullRequestView = (props: PullRequestViewProps) => (
  <div className={styles("pull-request-view-wrapper")}>
    <h3>
      <a href={props.pullRequest.url} rel="noopener noreferrer" target="_blank">
        {props.pullRequest.title}
      </a>
    </h3>
  </div>
);
