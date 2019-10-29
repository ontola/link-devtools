import React from "react";
import { render } from "react-dom";

import { Panel } from './panel/index'

function init() {
  render(
    React.createElement(Panel),
    document.getElementById("root")
  )
}

window.onload = init;
