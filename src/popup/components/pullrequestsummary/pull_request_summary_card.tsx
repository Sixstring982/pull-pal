import React from "react";
import { PullRequestGroupResult } from "../../../api/pull_request_summary";
import { useObservable } from "../../../common/util/hooks";
import { mapUndefinable, toList } from "../../../common/util/nullable";
import { mapStyles } from "../../../common/util/styles";
import { RUNTIME_REQUEST_SERVICE } from "../../services/runtimerequest/runtime_request_service";
import { getServiceContainer } from "../../services/service_container";
import { PullRequestGroupView } from "./pull_request_group_view";

import styleMap from "./pull_request_summary_card.scss";
const styles = mapStyles(styleMap);

export const PullRequestSummaryCard = () => {
  const runtimeRequestService = getServiceContainer().resolve(
    RUNTIME_REQUEST_SERVICE
  );
  const pullRequestSummary = useObservable(
    runtimeRequestService.getPullRequestSummary$()
  );

  const refreshPullRequests = () => {
    runtimeRequestService.refreshPullRequestSummary();
  };

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
      {groupViews}
    </div>
  );
};
