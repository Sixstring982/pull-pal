import React from "react";
import { useObservable } from "../../../common/util/hooks";
import { mapStyles } from "../../../common/util/styles";
import { RUNTIME_REQUEST_SERVICE } from "../../services/runtimerequest/runtime_request_service";
import { getServiceContainer } from "../../services/service_container";

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

  return (
    <div className={styles("card")}>
      <h1>Pull requests</h1>
      <button onClick={refreshPullRequests}>Refresh</button>
      {JSON.stringify(pullRequestSummary)}
    </div>
  );
};
