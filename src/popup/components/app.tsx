import React from "react";
import { mapStyles } from "../../common/util/styles";

import styleMap from "./app.scss";
import { PullRequestSummaryCard } from "./pullrequestsummary/pull_request_summary_card";
const styles = mapStyles(styleMap);

export const App = () => (
  <section className={styles("app-wrapper")}>
    <PullRequestSummaryCard />
  </section>
);
