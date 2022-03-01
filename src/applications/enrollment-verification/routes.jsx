import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {
  REVIEW_ENROLLMENTS_URL_SEGMENT,
  VERIFY_ENROLLMENTS_URL_SEGMENT,
} from './constants';
import EnrollmentVerificationIntroPage from './containers/EnrollmentVerificationIntroPage';
import EnrollmentVerificationPage from './containers/EnrollmentVerificationPage';
import VerifyEnrollmentsPage from './containers/VerifyEnrollmentsPage';

const routes = (
  <Switch>
    <Route exact path="/" key="EnrollmentVerificationIntroPage">
      <EnrollmentVerificationIntroPage />
    </Route>
    <Route
      exact
      key="EnrollmentVerificationPage"
      path={`/${REVIEW_ENROLLMENTS_URL_SEGMENT}/`}
    >
      <EnrollmentVerificationPage />
    </Route>
    <Route
      exact
      key="VerifyEnrollmentsPage"
      path={`/${REVIEW_ENROLLMENTS_URL_SEGMENT}/${VERIFY_ENROLLMENTS_URL_SEGMENT}/`}
    >
      <VerifyEnrollmentsPage />,
    </Route>
  </Switch>
);

export default routes;
