import React from 'react';
import { Route } from 'react-router';

import { App } from './containers/App';

const routes = (
  <Route path="/" component={App}>
    <Route path="form-renderer" component={App} />
    {/* other children */}
  </Route>
);

export default routes;
