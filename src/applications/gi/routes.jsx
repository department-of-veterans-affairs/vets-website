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
// import SchoolsAndEmployers from './updated-gi/containers/SchoolsAndEmployers';
import HomePage from './updated-gi/components/Homepage';

const BuildRoutes = () => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const isUpdatedGi = useToggleValue(TOGGLE_NAMES.isUpdatedGi);
  const lcToggleValue = useToggleValue(
    TOGGLE_NAMES.giComparisonToolLceToggleFlag,
  );
  const toggleGiProgramsFlag = useToggleValue(
    TOGGLE_NAMES.giComparisonToolProgramsToggleFlag,
  );

  return (
    <>
      {!isUpdatedGi ? (
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
        <Switch>
          <Route exact path="/">
            <NewGiApp>
              <HomePage />
            </NewGiApp>
          </Route>
          <GiBillApp>
            <Switch>
              <Redirect
                from="/profile/:facilityCode"
                to="/institution/:facilityCode"
              />
              <Route
                path="/schools-and-employers/institution/:facilityCode"
                render={({ match }) => <ProfilePage match={match} />}
              />
              <Route
                path="/schools-and-employers/compare"
                render={({ match }) => <ComparePage match={match} />}
              />
              <Route
                path="/schools-and-employers"
                render={({ match }) => <SearchPage match={match} />}
              />
              <Route
                path="/school-and-employers/compare"
                render={({ match }) => <ComparePage match={match} />}
              />
              <Route
                path="/national-exams/:examId"
                component={NationalExamDetails}
              />
              <Route path="/national-exams" component={NationalExamsList} />
            </Switch>
          </GiBillApp>
        </Switch>
      )}
    </>
  );
};
export const buildRoutes = () => <BuildRoutes />;
