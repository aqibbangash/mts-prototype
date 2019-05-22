import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import AdminLayout from "./layouts/Admin/Admin.jsx";
import Screenshots from "./views/screenshots/screenshots.js"

import "./assets/scss/black-dashboard-react.scss";
import "./assets/demo/demo.css";
import "./assets/css/nucleo-icons.css";

const hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/home" render={props => <AdminLayout {...props} />} />
      // <Redirect from="/" to="/home/main" />
    </Switch>
  </Router>,
  document.getElementById("root")
);
