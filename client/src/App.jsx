import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import HomeView from "./views/Home";
import DonationView from "./views/Donation";
import Signup from "./views/Signup";
import Signin from "./views/Signin";
import NavigationBar from "./components/NavigationBar";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      <Router>
        <NavigationBar />
        <Switch>
          <Route path="/" exact component={HomeView} />
          <Route path="/donation" exact component={DonationView} />
          <Route path="/signin" exact component={Signin} />
          <Route path="/signup" exact component={Signup} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
