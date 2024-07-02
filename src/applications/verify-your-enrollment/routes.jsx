import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import backendServices from 'platform/user/profile/constants/backendServices';
import { selectUser } from '@department-of-veterans-affairs/platform-user/selectors';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { useSelector } from 'react-redux';
import {
  BENEFITS_PROFILE_RELATIVE_URL,
  VERIFICATION_REVIEW_RELATIVE_URL,
} from './constants';
import EnrollmentVerificationPageWrapper from './containers/EnrollmentVerificationPageWrapper';
import BenefitsProfileWrapper from './containers/BenefitsProfilePageWrapper';
import VerificationReviewWrapper from './containers/VerificationReviewWrapper';
import LoadFail from './components/LoadFail';
import Loader from './components/Loader';

const IsUserLoggedIn = () => {
  const user = useSelector(selectUser);
  const response = useSelector(state => state.personalInfo);
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const toggleValue = useToggleValue(TOGGLE_NAMES.toggleVyeApplication);
  const serverError = response?.error?.errors
    ? response?.error?.errors[0]
    : response?.error;

  const isError500 = useMemo(() => parseInt(serverError?.status, 10) === 500, [
    serverError,
  ]);

  const Routes = useMemo(
    () => (
      <Switch>
        <Route exact key="EnrollmentVerificationPage" path="/">
          <EnrollmentVerificationPageWrapper />
        </Route>
        <Route
          exact
          key="BenefitsProfilePage"
          path={BENEFITS_PROFILE_RELATIVE_URL}
        >
          <BenefitsProfileWrapper />
        </Route>
        <Route
          exact
          key="VerificationReview"
          path={VERIFICATION_REVIEW_RELATIVE_URL}
        >
          <VerificationReviewWrapper />
        </Route>
      </Switch>
    ),
    [],
  );
  if (toggleValue === undefined && !window.isProduction) {
    return <Loader />;
  }

  return toggleValue || window.isProduction ? (
    <RequiredLoginView
      serviceRequired={backendServices.USER_PROFILE}
      user={user}
    >
      {isError500 ? <LoadFail /> : Routes}
    </RequiredLoginView>
  ) : (
    <div className="not-found">
      <PageNotFound />
    </div>
  );
};

const routes = <IsUserLoggedIn />;

export default routes;
