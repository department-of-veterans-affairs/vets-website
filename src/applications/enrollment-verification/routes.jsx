import React from 'react';
import { Route } from 'react-router';
import {
  REVIEW_ENROLLMENTS_URL_SEGMENT,
  VERIFY_ENROLLMENTS_URL_SEGMENT,
} from './constants';
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
    path={`/${REVIEW_ENROLLMENTS_URL_SEGMENT}/`}
    key="EnrollmentVerificationPage"
    component={EnrollmentVerificationPage}
  />,
  <Route
    path={`/${REVIEW_ENROLLMENTS_URL_SEGMENT}/${VERIFY_ENROLLMENTS_URL_SEGMENT}/`}
    key="VerifyEnrollmentsPage"
    component={VerifyEnrollmentsPage}
  />,
];

export default routes;
