import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Layout from './components/Layout';
import Introduction from './components/Introduction';
import Form from './components/Form';
import Confirmation from './components/Confirmation';

const routes = (
  <Route path="/">
    <Route component={Layout} key="/main">
      <IndexRoute component={Introduction} key="/intro" />
      <Route component={Form} key="/apply" path="/form" />
      <Route
        component={Confirmation}
        key="/confirmation"
        path="/confirmation"
      />
    </Route>
  </Route>
);

export default routes;
