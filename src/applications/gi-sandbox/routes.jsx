import GiBillApp from './containers/GiBillApp';
import SearchPage from './containers/SearchPage';
import { Route, Switch, Redirect } from 'react-router-dom';
import React from 'react';
import ComparePage from './containers/ComparePage';
import ProfilePage from './containers/ProfilePage';

export const buildRoutes = () => {
  return (
    <GiBillApp>
      <Switch>
        <Redirect
          from="/profile/:facilityCode"
          to="/institution/:facilityCode"
        />
        <Route
          path="/institution/:facilityCode"
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
