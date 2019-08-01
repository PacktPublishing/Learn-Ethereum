import React from "react";
import {  Route, Switch } from "react-router-dom";

import ArtHome from './ArtHome';
import PublishArt from './PublishArt';
import MyWallet from './MyWallet';
class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={ArtHome} />
        <Route exact path="/home" component={ArtHome} />
        <Route exact path="/publishArt" component={PublishArt} />
        <Route exact path="/myWallet" component={MyWallet} />
        

      <Route
        render={function() {
          return <h1>Not Found</h1>;
        }}
      />
    </Switch>

    );
  }
}

export default Routes;
