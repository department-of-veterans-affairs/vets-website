import React from 'react';
import { Route, IndexRoute } from 'react-router';

import CoronavirusVaccinationApp from './containers/CoronavirusVaccinationApp';
import Introduction from './components/Introduction';
import Form from './components/Form';
import Confirmation from './components/Confirmation';

const routes = (
  <Route path="/">
    <Route component={CoronavirusVaccinationApp} key="/main">
      <IndexRoute component={Introduction} key="/intro" />
      <Route component={Form} key="/apply" path="/apply" />
      <Route
        component={Confirmation}
        key="/confirmation"
        path="/confirmation"
      />
    </Route>
  </Route>
);

export default routes;
