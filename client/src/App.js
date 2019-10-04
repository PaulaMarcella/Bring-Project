import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./views/Home";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" component={home} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
