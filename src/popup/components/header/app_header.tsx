import React from "react";
import { mapStyles } from "../../../common/util/styles";

import styleMap from "./app_header.scss";
const styles = mapStyles(styleMap);

export const AppHeader = () => (
  <div className={styles("header-wrapper")}>
    <div className={styles("logo")}>Pull Pal</div>
    <div className={styles("nav")}>
      <button className={"material-symbols-outlined " + styles("fab")}>
        settings
      </button>
    </div>
  </div>
);
