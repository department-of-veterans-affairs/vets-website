import GiBillApp from './containers/GiBillApp';
import LandingPage from './containers/LandingPage';
import { Route, Switch } from 'react-router-dom';
import React from 'react';

export const buildRoutes = () => {
  return (
    <GiBillApp>
      <Switch>
        <Route path="/" render={({ match }) => <LandingPage match={match} />} />
      </Switch>
    </GiBillApp>
  );
};
