import React from 'react';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';

import { isLoggedIn, isProfileLoading, createIsServiceAvailableSelector } from '../../../../platform/user/selectors';
import RequiredLoginView from '../../../../platform/user/authorization/components/RequiredLoginView';
import backendServices from '../../../../platform/user/profile/constants/backendServices';

export function BetaGate({ user, claimsAccess, loading, betaUser, formAvailable, loggedIn, location, children }) {
  if (loading) {
    return (
      <div className="usa-grid full-page-alert">
        <LoadingIndicator message="Loading your profile information..."/>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="usa-grid full-page-alert">
        <AlertBox
          isVisible
          headline="You are not signed in"
          content="Please sign in to view this application."
          status="warning"/>
      </div>
    );
  }

  if (!formAvailable) {
    return (
      <div className="usa-grid full-page-alert">
        <AlertBox status="warning"
          isVisible
          content={<div><h3>We’re sorry. The increased disability compensation tool is unavailable right now.</h3><p>We can accept only a limited number of submissions a day while we’re in beta. Please check back again soon.</p></div>}/>
      </div>
    );
  }

  if (!betaUser) {
    return (
      <div className="usa-grid full-page-alert">
        <AlertBox status="warning"
          isVisible
          content={<div><h3>The increased disability compensation application is a beta tool.</h3><p>Please visit the beta enrollment page for information on how to try out the beta tool. <a href="/beta-enrollment/claim-increase">Go to the beta enrollment page</a>.</p></div>}/>
      </div>
    );
  }

  // Short-circuit the check on the intro page
  if (location.pathname === '/introduction') {
    return children;
  }

  if (!claimsAccess) {
    return (
      <div className="usa-grid full-page-alert">
        <AlertBox
          isVisible
          headline="We’re sorry. It looks like we’re missing some information needed for your application"
          content="For help with your application, please call Veterans Benefits Assistance at 1-800-827-1000, Monday – Friday, 8:00 a.m. to 9:00 p.m. (ET)."
          status="error"/>
      </div>
    );
  }

  return (
    <RequiredLoginView
      serviceRequired={backendServices.EVSS_CLAIMS}
      user={user}
      verify>
      {children}
    </RequiredLoginView>
  );
}

const isBetaUser = createIsServiceAvailableSelector(backendServices.CLAIM_INCREASE);
const isFormAvailable = createIsServiceAvailableSelector(backendServices.CLAIM_INCREASE_AVAILABLE);
const hasClaimsAccess = createIsServiceAvailableSelector(backendServices.EVSS_CLAIMS);

const mapStateToProps = (state) => ({
  loggedIn: isLoggedIn(state),
  loading: isProfileLoading(state),
  formAvailable: isFormAvailable(state),
  claimsAccess: hasClaimsAccess(state),
  betaUser: isBetaUser(state),
  user: state.user
});

export default connect(mapStateToProps)(BetaGate);
