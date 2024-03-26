import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {
  BENEFITS_PROFILE_RELATIVE_URL,
  VERIFICATION_REVIEW_RELATIVE_URL,
  CONFIRMATION_REVIEW_RELATIVE_URL,
} from './constants';
// import App from './containers/App';
import EnrollmentVerificationPageWrapper from './containers/EnrollmentVerificationPageWrapper';
import BenefitsProfileWrapper from './containers/BenefitsProfilePageWrapper';
import VerificationReviewWrapper from './containers/VerificationReviewWrapper';
import ConfirmationReviewWrapper from './containers/ConfirmationReviewWrapper';

const routes = (
  <Switch>
    <Route exact key="EnrollmentVerificationPage" path="/">
      <EnrollmentVerificationPageWrapper />
    </Route>
    <Route
      exact
      key="BenefitsProfilePage"
      path={`${BENEFITS_PROFILE_RELATIVE_URL}`}
    >
      <BenefitsProfileWrapper />
    </Route>
    <Route
      exact
      key="VerificationReview"
      path={`${VERIFICATION_REVIEW_RELATIVE_URL}`}
    >
      <VerificationReviewWrapper />
    </Route>
    <Route
      exact
      key="VerificationReview"
      path={`${CONFIRMATION_REVIEW_RELATIVE_URL}`}
    >
      <ConfirmationReviewWrapper />
    </Route>
  </Switch>
);

export default routes;
