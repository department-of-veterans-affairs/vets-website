import GiBillApp from './containers/GiBillApp';
import LandingPage from './containers/SearchPage';
import { Route, Switch } from 'react-router-dom';
import React from 'react';
import ComparePage from './containers/ComparePage';
import ProfilePage from './containers/ProfilePage';

export const buildRoutes = () => {
  return (
    <GiBillApp>
      <Switch>
        <Route
          path="/profile/:facilityCode/:preSelectedProgram"
          render={({ match }) => <ProfilePage match={match} />}
        />
        <Route
          path="/profile/:facilityCode"
          render={({ match }) => <ProfilePage match={match} />}
        />
        <Route
          path="/compare"
          render={({ match }) => <ComparePage match={match} />}
        />
        <Route path="/" render={({ match }) => <LandingPage match={match} />} />
      </Switch>
    </GiBillApp>
  );
};
