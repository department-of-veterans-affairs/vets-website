import { Route, Switch, Redirect } from 'react-router-dom';
import React from 'react';
import GiBillApp from './containers/GiBillApp';
import SearchPage from './containers/SearchPage';
import ComparePage from './containers/ComparePage';
import ProfilePage from './containers/ProfilePage';
import ProgramsList from './containers/ProgramsList';
import LicenseCertificationSearchResults from './containers/LicenseCertificationSearchResults';
import LicenseCertificationSearch from './components/LicenseCertificationSearch';

export const buildRoutes = () => {
  return (
    <GiBillApp>
      <Switch>
        <Redirect
          from="/profile/:facilityCode"
          to="/institution/:facilityCode"
        />
        <Route
          path="/institution/:facilityCode/:programType"
          render={({ match }) => <ProgramsList match={match} />}
        />
        <Route
          path="/institution/:facilityCode"
          render={({ match }) => <ProfilePage match={match} />}
        />
        <Route
          path="/lc-search"
          render={({ match }) => <LicenseCertificationSearch match={match} />}
        />
        <Route
          path="/lc-search/results"
          render={({ match }) => (
            <LicenseCertificationSearchResults match={match} />
          )}
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
