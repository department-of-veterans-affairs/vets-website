import React from 'react';
import { Route } from 'react-router';
import EnrollmentVerificationIntroPage from './containers/EnrollmentVerificationIntroPage';
import EnrollmentVerificationPage from './containers/EnrollmentVerificationPage';
import VerifyEnrollmentsPage from './containers/VerifyEnrollmentsPage';

const routes = [
  <Route
    path="/"
    key="EnrollmentVerificationIntroPage"
    component={EnrollmentVerificationIntroPage}
  />,
  <Route
    path="/review-enrollments"
    key="EnrollmentVerificationPage"
    component={EnrollmentVerificationPage}
  />,
  <Route
    path="/verify-enrollments"
    key="VerifyEnrollmentsPage"
    component={VerifyEnrollmentsPage}
  />,
];

export default routes;
