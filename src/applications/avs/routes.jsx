import React from 'react';
import { Route, Switch } from 'react-router-dom';

// import App from './containers/App';
import Avs from './containers/Avs';

// TODO: user authorization.
const routes = (
  <div className="vads-l-grid-container main-content">
    <Switch>
      <Route path="/:id">
        <Avs />
      </Route>
    </Switch>
  </div>
);

export default routes;
