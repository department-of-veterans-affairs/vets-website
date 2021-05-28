import React from 'react';
import { Route, Switch } from 'react-router-dom';
import App from './containers/App.jsx';

const createRoutesWithStore = () => {
  return (
    <Switch>
      <Route path="/*" exact component={App} />
    </Switch>
  );
};
export default createRoutesWithStore;
