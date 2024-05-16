import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import backendServices from 'platform/user/profile/constants/backendServices';
import { selectUser } from '@department-of-veterans-affairs/platform-user/selectors';
import { useSelector } from 'react-redux';
import {
  BENEFITS_PROFILE_RELATIVE_URL,
  VERIFICATION_REVIEW_RELATIVE_URL,
} from './constants';
// import App from './containers/App';
import EnrollmentVerificationPageWrapper from './containers/EnrollmentVerificationPageWrapper';
import BenefitsProfileWrapper from './containers/BenefitsProfilePageWrapper';
import VerificationReviewWrapper from './containers/VerificationReviewWrapper';

const IsUserLoggedIn = () => {
  const user = useSelector(selectUser);
  return (
    <RequiredLoginView
      serviceRequired={backendServices.USER_PROFILE}
      user={user}
    >
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
      </Switch>
    </RequiredLoginView>
  );
};

const routes = <IsUserLoggedIn />;

export default routes;
