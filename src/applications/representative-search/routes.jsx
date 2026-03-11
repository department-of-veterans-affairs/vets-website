import React from 'react';
import { Route, Switch } from 'react-router-dom';
import App from './containers/App';
import SearchPage from './containers/SearchPage';

const routes = (
  <Switch>
    <Route key="RepresentativeSearchPage" path="/">
      <App>
        <SearchPage />
      </App>
    </Route>
  </Switch>
);

export default routes;
