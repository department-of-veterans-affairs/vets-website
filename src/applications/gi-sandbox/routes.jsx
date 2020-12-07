import GiBillApp from './containers/GiBillApp';
import LandingPage from './containers/LandingPage';
import SearchPage from '../gi/containers/SearchPage';
import VetTecSearchPage from '../gi/containers/VetTecSearchPage';
import ProfilePage from '../gi/containers/ProfilePage';
import { Route, Switch } from 'react-router-dom';
import React from 'react';

export const buildRoutes = () => {
  return (
    <GiBillApp>
      <Switch>
        <Route
          path="/search"
          render={({ match }) => <SearchPage match={match} />}
        />
        <Route
          path="/program-search"
          render={({ match }) => <VetTecSearchPage match={match} />}
        />
        <Route
          path="/profile/:facilityCode/:preSelectedProgram"
          render={({ match }) => <ProfilePage match={match} />}
        />
        <Route
          path="/profile/:facilityCode"
          render={({ match }) => <ProfilePage match={match} />}
        />
        <Route path="/" render={({ match }) => <LandingPage match={match} />} />
      </Switch>
    </GiBillApp>
  );
};
