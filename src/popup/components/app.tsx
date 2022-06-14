import React from "react";
import { mapStyles } from "../../common/util/styles";

import styleMap from "./app.scss";
import { AppHeader } from "./header/app_header";
import { PullRequestSummaryCard } from "./pullrequestsummary/pull_request_summary_card";
const styles = mapStyles(styleMap);

export const App = () => (
  <article className={styles("app-wrapper")}>
    <AppHeader />
    <PullRequestSummaryCard />
  </article>
);
