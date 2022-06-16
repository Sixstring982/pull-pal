import React, { useCallback, useEffect, useRef, useState } from "react";
import moment from "moment";
import {
  PullRequestGroup,
  PullRequestGroupResult,
} from "../../../api/pull_request_summary";
import { PullRequestView, PullRequestViewFlag } from "./pull_request_view";
import { mapStyles } from "../../../common/util/styles";

import styleMap from "./pull_request_group_view.scss";
const styles = mapStyles(styleMap);

export interface PullRequestGroupViewProps {
  readonly pullRequestGroup: PullRequestGroupResult;
  readonly title: string;
  readonly tooltip?: string;
}

export const PullRequestGroupView = (props: PullRequestGroupViewProps) => {
  if (props.pullRequestGroup.kind === "PullRequestGroup") {
    return (
      <Group
        group={props.pullRequestGroup}
        title={props.title}
        tooltip={props.tooltip}
      />
    );
  }

  const content = (() => {
    switch (props.pullRequestGroup.kind) {
      case "PullRequestGroupNotYetFetched":
        return "Press 'Refresh' to fetch.";
      case "PullRequestGroupFetchError":
        return (
          "An error occurred while fetching pull requests: " +
          props.pullRequestGroup.errors.join("; ")
        );
    }
  })();

  return (
    <div className={styles("error-group")}>
      <h2 title={props.tooltip}>{props.title}</h2>
      {content}
    </div>
  );
};

interface PullRequestGroupContentProps {
  readonly group: PullRequestGroup;
  readonly title: string;
  readonly tooltip?: string;
}

const Group = (props: PullRequestGroupContentProps) => {
  if (props.group.pullRequests.length === 0) {
    return (
      <div className={styles("empty-group")}>
        <h2 title={props.tooltip}>{props.title}</h2>
        You're caught up!
      </div>
    );
  }

  const [_, refresh] = useState(undefined);
  useEffect(() => {
    const intervalId = setInterval(() => {
      refresh(undefined);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const views = props.group.pullRequests.map((pr) => (
    <div key={pr.id} className={styles("pr-view")}>
      <PullRequestView
        pullRequest={pr}
        options={new Set<PullRequestViewFlag>(["show-author", "show-age"])}
      />
    </div>
  ));

  const freshness = new Date(props.group.fetchedAtEpochMillis);

  return (
    <div className={styles("prs-group")}>
      <div className={styles("status-row")}>
        <h2 className={styles("group-header")} title={props.tooltip}>
          {props.title}: {props.group.pullRequests.length}
        </h2>
        <small>Last refreshed {moment(freshness).fromNow()}</small>
      </div>
      <section className={styles("pr-views")}>{views}</section>
    </div>
  );
};
