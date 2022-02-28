/**
 * This is the entry point for developing and debugging.
 * This file is not bundled with the block during the build process.
 */
import React from "react";
import ReactDOM from "react-dom";

// eslint-disable-next-line import/no-extraneous-dependencies -- TODO update config properly
import { MockBlockDock } from "mock-block-dock";

import Component from "./index";
import packageJSON from "../package.json";
const node = document.getElementById("app");

const { blockprotocol = {} } = packageJSON;

const App = () => (
  <MockBlockDock>
    <Component
      entityId="test-block-1"
      {...(blockprotocol.examples?.[0] ?? {})}
    />
  </MockBlockDock>
);

ReactDOM.render(<App />, node);
