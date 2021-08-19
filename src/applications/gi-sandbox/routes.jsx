import GiBillApp from './containers/GiBillApp';
import SearchPage from './containers/SearchPage';
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
        <Route path="/" render={({ match }) => <SearchPage match={match} />} />
      </Switch>
    </GiBillApp>
  );
};
