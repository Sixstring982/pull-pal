import React from "react";
import { PullRequestGroupResult } from "../../../api/pull_request_summary";
import { mapStyles } from "../../../common/util/styles";

import styleMap from "./pull_request_group_view.scss";
import { PullRequestView } from "./pull_request_view";
const styles = mapStyles(styleMap);

export interface PullRequestGroupViewProps {
  readonly pullRequestGroup: PullRequestGroupResult;
  readonly title: string;
}

export const PullRequestGroupView = (props: PullRequestGroupViewProps) => {
  const countLabel = (() => {
    if (props.pullRequestGroup.kind === "PullRequestGroup") {
      return `: ${props.pullRequestGroup.pullRequests.length}`;
    }
    return undefined;
  })();

  const content = (() => {
    switch (props.pullRequestGroup.kind) {
      case "PullRequestGroupNotYetFetched":
        return "Press 'Refresh' to fetch.";
      case "PullRequestGroupFetchError":
        return `An error occurred while fetching pull requests: ${props.pullRequestGroup.errors.join(
          "; "
        )}`;
      case "PullRequestGroup":
        return props.pullRequestGroup.pullRequests.map((pr) => (
          <PullRequestView key={pr.id} pullRequest={pr} />
        ));
    }
  })();

  return (
    <div className={styles("pull-request-group-wrapper")}>
      <h2>
        {props.title}
        {countLabel}
      </h2>
      {content}
    </div>
  );
};
