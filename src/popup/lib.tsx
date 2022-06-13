import React from 'react';
import { createRoot } from "react-dom/client";
import { App } from "./components/app";

export const libMain = () => {
  const rootElement = document.getElementById("react-root");
  if (rootElement === null) {
    throw new Error('Expected to find element with ID "react-root"!');
  }

  createRoot(rootElement).render(<App />);
};
