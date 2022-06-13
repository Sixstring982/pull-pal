import React from "react";
import { mapStyles } from "../../common/util/styles";

import styleMap from "./app.scss";
const styles = mapStyles(styleMap);

export const App = () => <div className={styles('cool-div')}>I'm an app</div>;
