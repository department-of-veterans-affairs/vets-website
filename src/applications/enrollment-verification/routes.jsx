import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {
  REVIEW_ENROLLMENTS_RELATIVE_URL,
  VERIFY_ENROLLMENTS_ERROR_RELATIVE_URL,
  VERIFY_ENROLLMENTS_RELATIVE_URL,
} from './constants';
import EnrollmentVerificationIntroPage from './containers/EnrollmentVerificationIntroPage';
import EnrollmentVerificationPage from './containers/EnrollmentVerificationPage';
import VerifyEnrollmentsPage from './containers/VerifyEnrollmentsPage';
import VerifyEnrollmentsErrorPage from './containers/VerifyEnrollmentsErrorPage';

const routes = (
  <Switch>
    <Route exact path="/" key="EnrollmentVerificationIntroPage">
      <EnrollmentVerificationIntroPage />
    </Route>
    <Route
      exact
      key="EnrollmentVerificationPage"
      path={REVIEW_ENROLLMENTS_RELATIVE_URL}
    >
      <EnrollmentVerificationPage />
    </Route>
    <Route
      exact
      key="VerifyEnrollmentsPage"
      path={VERIFY_ENROLLMENTS_RELATIVE_URL}
    >
      <VerifyEnrollmentsPage />,
    </Route>
    <Route
      exact
      key="VerifyEnrollmentsErrorPage"
      path={VERIFY_ENROLLMENTS_ERROR_RELATIVE_URL}
    >
      <VerifyEnrollmentsErrorPage />,
    </Route>
  </Switch>
);

export default routes;
