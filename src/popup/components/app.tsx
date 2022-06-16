import React, { useState } from "react";
import { mapStyles } from "../../common/util/styles";

import styleMap from "./app.scss";
import { AppHeader } from "./header/app_header";
import { PullRequestSummaryCard } from "./pullrequestsummary/pull_request_summary_card";
import { SettingsView } from "./settings/settings_view";
const styles = mapStyles(styleMap);

export const App = () => {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const toggleSettings = () => {
    setSettingsVisible(!settingsVisible);
  };

  return (
    <article className={styles("app-wrapper")}>
      <AppHeader onSettingsButtonClick={toggleSettings} />
      {(() => {
        if (settingsVisible) {
          return <SettingsView />;
        }
        return (
          <PullRequestSummaryCard onSettingsButtonClick={toggleSettings} />
        );
      })()}
    </article>
  );
};
