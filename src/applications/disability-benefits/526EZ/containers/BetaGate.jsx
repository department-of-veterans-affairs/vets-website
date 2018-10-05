import React from 'react';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';

import {
  isLoggedIn,
  isProfileLoading,
  createIsServiceAvailableSelector,
} from '../../../../platform/user/selectors';
import backendServices from '../../../../platform/user/profile/constants/backendServices';

export function BetaGate({
  loading,
  betaUser,
  formAvailable,
  loggedIn,
  children,
}) {
  if (loading) {
    return (
      <div className="usa-grid full-page-alert">
        <LoadingIndicator message="Loading your profile information..." />
      </div>
    );
  }

  if (loggedIn && !formAvailable) {
    return (
      <div className="usa-grid full-page-alert">
        <AlertBox
          status="warning"
          isVisible
          content={
            <div>
              <h3>
                We’re sorry. The increased disability compensation tool is
                unavailable right now.
              </h3>
              <p>
                We can accept only a limited number of submissions a day while
                we’re in beta. Please check back again soon.
              </p>
            </div>
          }
        />
      </div>
    );
  }

  if (loggedIn && !betaUser) {
    return (
      <div className="usa-grid full-page-alert">
        <AlertBox
          status="warning"
          isVisible
          content={
            <div>
              <h3>
                The increased disability compensation application is a beta
                tool.
              </h3>
              <p>
                Please visit the beta enrollment page for information on how to
                try out the beta tool.{' '}
                <a href="/beta-enrollment/claim-increase">
                  Go to the beta enrollment page
                </a>
                .
              </p>
            </div>
          }
        />
      </div>
    );
  }

  return <div>{children}</div>;
}

const isBetaUser = createIsServiceAvailableSelector(
  backendServices.CLAIM_INCREASE,
);
const isFormAvailable = createIsServiceAvailableSelector(
  backendServices.CLAIM_INCREASE_AVAILABLE,
);
const hasClaimsAccess = createIsServiceAvailableSelector(
  backendServices.EVSS_CLAIMS,
);

const mapStateToProps = state => ({
  loggedIn: isLoggedIn(state),
  loading: isProfileLoading(state),
  formAvailable: isFormAvailable(state),
  claimsAccess: hasClaimsAccess(state),
  betaUser: isBetaUser(state),
  user: state.user,
});

export default connect(mapStateToProps)(BetaGate);
