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

  if (user.login.currentlyLoggedIn && !user.profile.services.includes(backendServices.EVSS_CLAIMS)) {
    return (
      <div className="usa-grid full-page-alert">
        <AlertBox
          isVisible
          headline="Nope"
          content="Looks like we don't have all the information we need. Please call the call center."
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

const mapStateToProps = (store) => ({
  user: store.user
});

export default connect(mapStateToProps)(EVSSClaimsGate);
