import { Route, Switch, Redirect } from 'react-router-dom';
import React from 'react';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import GiBillApp from './containers/GiBillApp';
import SearchPage from './containers/SearchPage';
import ComparePage from './containers/ComparePage';
import ProfilePage from './containers/ProfilePage';
import ProgramsList from './containers/ProgramsList';
import LicenseCertificationSearchResults from './containers/LicenseCertificationSearchResults';
import LicenseCertificationSearchResult from './containers/LicenseCertificationSearchResult';
import LicenseCertificationSearchPage from './containers/LicenseCertificationSearchPage';
import NationalExamsList from './containers/NationalExamsList';
import NewGiApp from './updated-gi/containers/NewGiApp';
import HomePage from './updated-gi/components/Homepage';

const BuildRoutes = () => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const toggleValue = useToggleValue(TOGGLE_NAMES.isUpdatedGi);
  return (
    <>
      {!toggleValue ? (
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
              exact
              path="/lc-search"
              render={({ match }) => (
                <LicenseCertificationSearchPage match={match} />
              )}
            />
            <Route
              exact
              path="/lc-search/results"
              render={({ match }) => (
                <LicenseCertificationSearchResults match={match} />
              )}
            />
            <Route path="/national-exams" component={NationalExamsList} />

            <Route
              path="/lc-search/results/:type/:id"
              render={({ match }) => (
                <LicenseCertificationSearchResult match={match} />
              )}
            />
            <Route
              path="/compare"
              render={({ match }) => <ComparePage match={match} />}
            />
            <Route
              path="/"
              render={({ match }) => <SearchPage match={match} />}
            />
          </Switch>
        </GiBillApp>
      ) : (
        <NewGiApp>
          <Switch>
            <Route
              path="/"
              exact
              render={({ match }) => <HomePage match={match} />}
            />
          </Switch>
        </NewGiApp>
      )}
    </>
  );
};
export const buildRoutes = () => <BuildRoutes />;
