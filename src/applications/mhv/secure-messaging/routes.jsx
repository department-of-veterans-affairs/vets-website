import React from 'react';
import { Switch, Route } from 'react-router-dom';
import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import App from './containers/App';

const routes = (
  <Switch>
    <Route path="/" key="App">
      <DowntimeNotification
        appTitle="Secure Messaging"
        dependencies={[externalServices.mhv]}
      >
        <App />
      </DowntimeNotification>
    </Route>
  </Switch>
);

export default routes;
