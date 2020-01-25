import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./assets/lib/scss/black-dashboard-react.scss";
import LandingPage from "./pages/LandingPage";
import UserPage from "./pages/UserPage";

class App extends Component {
  state = {};
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/user" component={UserPage} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
