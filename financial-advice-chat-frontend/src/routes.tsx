import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import PrivateRoute from "./components/PrivateRoute";

const Routes: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <PrivateRoute path="/chat" component={Chat} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
};

export default Routes;
