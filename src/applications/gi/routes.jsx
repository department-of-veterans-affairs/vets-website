// Legacy Pages
import LegacyGiBillApp from './containers/GiBillApp';
import LegacyLandingPage from './containers/LandingPage';
import LegacySearchPage from './containers/SearchPage';
import LegacyVetTecSearchPage from './containers/VetTecSearchPage';
import LegacyProfilePage from './containers/ProfilePage';

// Redesigned Pages
import GiBillApp from '../gi-sandbox/containers/GiBillApp';
import SearchPage from '../gi-sandbox/containers/SearchPage';
import ComparePage from '../gi-sandbox/containers/ComparePage';
import ProfilePage from '../gi-sandbox/containers/ProfilePage';

// Routing
import { Route, Switch, Redirect } from 'react-router-dom';
import React from 'react';

const fakeFlag = true;

export const buildRoutes = () => {
  return fakeFlag ? (
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
  ) : (
    <LegacyGiBillApp>
      <Switch>
        <Route
          path="/search"
          render={({ match }) => <LegacySearchPage match={match} />}
        />
        <Route
          path="/program-search"
          render={({ match }) => <LegacyVetTecSearchPage match={match} />}
        />
        <Route
          path="/profile/:facilityCode/:preSelectedProgram"
          render={({ match }) => <LegacyProfilePage match={match} />}
        />
        <Route
          path="/profile/:facilityCode"
          render={({ match }) => <LegacyProfilePage match={match} />}
        />
        <Route
          path="/"
          render={({ match }) => <LegacyLandingPage match={match} />}
        />
      </Switch>
    </LegacyGiBillApp>
  );
};
