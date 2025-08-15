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
  const giCtCollab = useToggleValue(TOGGLE_NAMES.giCtCollab);
  const isUpdatedGi = useToggleValue(TOGGLE_NAMES.isUpdatedGi);
  const lcToggleValue = useToggleValue(
    TOGGLE_NAMES.giComparisonToolLceToggleFlag,
  );

  return (
    <>
      {isUpdatedGi && (
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
      {giCtCollab && (
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
              <Redirect
                from="/institution/:facilityCode"
                to="/schools-and-employers/institution/:facilityCode"
              />
              <Route
                path="/schools-and-employers/institution/:facilityCode/:programType"
                render={({ match }) => <ProgramsList match={match} />}
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
              {lcToggleValue && (
                <Route
                  exact
                  path="/licenses-certifications-and-prep-courses"
                  component={LicenseCertificationSearchPage}
                />
              )}
              {lcToggleValue && (
                <Route
                  exact
                  path="/licenses-certifications-and-prep-courses/results"
                  component={LicenseCertificationSearchResults}
                />
              )}
              {lcToggleValue && (
                <Route
                  path="/licenses-certifications-and-prep-courses/results/:id/:name"
                  component={LicenseCertificationSearchResult}
                />
              )}
              <Route
                path="/national-exams/:examId"
                component={NationalExamDetails}
              />
              <Route path="/national-exams" component={NationalExamsList} />
            </Switch>
          </GiBillApp>
        </Switch>
      )}
      {!giCtCollab &&
        !isUpdatedGi && (
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
              {lcToggleValue && (
                <Route
                  exact
                  path="/licenses-certifications-and-prep-courses"
                  component={LicenseCertificationSearchPage}
                />
              )}
              {lcToggleValue && (
                <Route
                  exact
                  path="/licenses-certifications-and-prep-courses/results"
                  component={LicenseCertificationSearchResults}
                />
              )}
              {lcToggleValue && (
                <Route
                  path="/licenses-certifications-and-prep-courses/results/:id/:name"
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
        )}
    </>
  );
};
export const buildRoutes = () => <BuildRoutes />;
