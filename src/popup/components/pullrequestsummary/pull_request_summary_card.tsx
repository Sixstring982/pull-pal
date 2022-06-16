import { KeyObject } from "crypto";
import React from "react";
import {
  DEFAULT_PULL_REQUEST_SUMMARY,
  getPullRequestGroups,
  PullRequestGroupResult,
} from "../../../api/pull_request_summary";
import { LOCAL_STORAGE_SERVICE } from "../../../common/services/localstorage/local_storage_service";
import { useObservable } from "../../../common/util/hooks";
import { mapUndefinable, toList } from "../../../common/util/nullable";
import { mapStyles } from "../../../common/util/styles";
import { RUNTIME_REQUEST_SERVICE } from "../../services/runtimerequest/runtime_request_service";
import { getServiceContainer } from "../../services/service_container";
import { PullRequestGroupView } from "./pull_request_group_view";

import styleMap from "./pull_request_summary_card.scss";
const styles = mapStyles(styleMap);

export interface PullRequestSummaryCardProps {
  readonly onSettingsButtonClick: () => void;
}

export const PullRequestSummaryCard = (props: PullRequestSummaryCardProps) => {
  const runtimeRequestService = getServiceContainer().resolve(
    RUNTIME_REQUEST_SERVICE
  );
  const pullRequestSummary = useObservable(
    runtimeRequestService.getPullRequestSummary$()
  );

  const refreshPullRequests = () => {
    runtimeRequestService.refreshPullRequestSummary();
  };

  const error = (() => {
    if (pullRequestSummary === undefined) {
      return undefined;
    }

    if (
      getPullRequestGroups(pullRequestSummary).some(
        (x) => x.kind === "PullRequestGroupFetchBadCredentials"
      )
    ) {
      return (
        <>
          GitHub did not accept your credentials!
          <button onClick={props.onSettingsButtonClick}>
            Configure credentials
          </button>
        </>
      );
    }
  })();

  const groupViews = mapUndefinable(pullRequestSummary, (summary) => (
    <>
      <PullRequestGroupView
        pullRequestGroup={summary.readyToReview}
        tooltip="Review these PRs quickly to unblock your teammates!"
        title="Ready to review"
      />
      <PullRequestGroupView
        pullRequestGroup={summary.readyToSubmit}
        tooltip="Submit these PRs: they're ready to go!"
        title="Ready to submit"
      />
      <PullRequestGroupView
        pullRequestGroup={summary.waitingForOthers}
        title="Waiting for other to review"
      />
      <PullRequestGroupView pullRequestGroup={summary.drafts} title="Drafts" />
    </>
  ));

  return (
    <div className={styles("pull-request-summary-card")}>
      <div className={styles("header-row")}>
        <h1>Pull requests</h1>
        <button
          className={"material-symbols-outlined " + styles("fab")}
          onClick={refreshPullRequests}
        >
          refresh
        </button>
      </div>
      {error}
      {groupViews}
    </div>
  );
};
