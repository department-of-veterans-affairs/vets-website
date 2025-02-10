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
import LicenseCertificationSearchPage from './components/LicenseCertificationSearchPage';
import NationalExamsList from './containers/NationalExamsList';
import NationalExamDetails from './containers/NationalExamDetails';
import NewGiApp from './updated-gi/containers/NewGiApp';
import SchoolsAndEmployers from './updated-gi/containers/SchoolsAndEmployers';
import HomePage from './updated-gi/components/Homepage';

const BuildRoutes = () => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const toggleValue = useToggleValue(TOGGLE_NAMES.isUpdatedGi);
  const lcToggleValue = useToggleValue(
    TOGGLE_NAMES.giComparisonToolLceToggleFlag,
  );
  const toggleGiProgramsFlag = useToggleValue(
    TOGGLE_NAMES.giComparisonToolProgramsToggleFlag,
  );

  return (
    <>
      {!toggleValue ? (
        <GiBillApp>
          <Switch>
            <Redirect
              from="/profile/:facilityCode"
              to="/institution/:facilityCode"
            />
            {toggleGiProgramsFlag && (
              <Route
                path="/institution/:facilityCode/:programType"
                render={({ match }) => <ProgramsList match={match} />}
              />
            )}
            <Route
              path="/institution/:facilityCode"
              render={({ match }) => <ProfilePage match={match} />}
            />
            {lcToggleValue && (
              <Route
                key="lc-search"
                exact
                path="/lc-search"
                render={({ match }) => (
                  <LicenseCertificationSearchPage
                    match={match}
                    flag="singleFetch"
                  />
                )}
              />
            )}
            {lcToggleValue && (
              <Route
                key="lc-search-results"
                exact
                path="/lc-search/results"
                render={({ match }) => (
                  <LicenseCertificationSearchResults
                    match={match}
                    flag="singleFetch"
                  />
                )}
              />
            )}
            {lcToggleValue && (
              <Route
                key="lc-search-result"
                path="/lc-search/results/:id"
                component={LicenseCertificationSearchResult}
              />
            )}
            <Route
              path="/national-exams/:examId"
              component={NationalExamDetails}
            />
            <Route path="/national-exams" component={NationalExamsList} />
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
            <Route exact path="/">
              <HomePage />
            </Route>
            <Route path="/schools-and-employers">
              <SchoolsAndEmployers />
            </Route>
          </Switch>
        </NewGiApp>
      )}
    </>
  );
};
export const buildRoutes = () => <BuildRoutes />;
