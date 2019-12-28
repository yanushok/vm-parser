import React from "react";
import ReactDOM from "react-dom";
import WebFont from "webfontloader";

import App from "components/App";

import "./index.scss";

WebFont.load({
    google: {
        families: ["Roboto:400,700", "sans-serif"]
    }
});

ReactDOM.render(
    <App />,
    document.getElementById("root")
);
