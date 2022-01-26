import React from 'react';
import { Route } from 'react-router';
import EnrollmentVerificationPage from './containers/EnrollmentVerificationPage';
import VerifyEnrollmentsPage from './containers/VerifyEnrollmentsPage';

const routes = [
  <Route
    path="/"
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
