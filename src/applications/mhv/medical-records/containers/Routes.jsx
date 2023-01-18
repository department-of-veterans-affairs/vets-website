import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import Vaccines from './Vaccines';

const Routes = () => {
  return (
    <div className="vads-u-flex--fill">
      <Switch>
        <Route exact path="/" key="App">
          <LandingPage />
        </Route>
        <Route exact path="/vaccines" key="Vaccines">
          <Vaccines />
        </Route>
      </Switch>
    </div>
  );
};

export default Routes;
