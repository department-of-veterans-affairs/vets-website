import React from 'react';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import RequiredLoginView from '../../../../platform/user/authorization/components/RequiredLoginView';
import backendServices from '../../../../platform/user/profile/constants/backendServices';

export function EVSSClaimsGate({ user, location, children }) {
  // Short-circuit the check on the intro page
  if (location.pathname === '/introduction') {
    return children;
  }

  if (
    user.login.currentlyLoggedIn &&
    !user.profile.services.includes(backendServices.EVSS_CLAIMS)
  ) {
    return (
      <div className="usa-grid full-page-alert">
        <AlertBox
          isVisible
          headline="We’re sorry. It looks like we’re missing some information needed for your application"
          content="For help with your application, please call Veterans Benefits Assistance at 1-800-827-1000, Monday – Friday, 8:00 a.m. to 9:00 p.m. (ET)."
          status="error"
        />
      </div>
    );
  }

  return (
    <RequiredLoginView
      serviceRequired={backendServices.EVSS_CLAIMS}
      user={user}
      verify
    >
      {children}
    </RequiredLoginView>
  );
}

const mapStateToProps = store => ({
  user: store.user,
});

export default connect(mapStateToProps)(EVSSClaimsGate);
