import React from 'react';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import backendServices from 'platform/user/profile/constants/backendServices';

import environment from 'platform/utilities/environment';

export function RequiredServicesGate({ user, location, children }) {
  // Short-circuit the check on the intro page
  if (location.pathname === '/introduction') {
    return children;
  }

  const currentlyLoggedIn = user.login.currentlyLoggedIn;
  const userProfileServices = user.profile.services;
  let missingInformation = !userProfileServices.includes(
    backendServices.FORM526,
  );
  if (missingInformation && !environment.isProduction()) {
    missingInformation = !userProfileServices.includes(
      backendServices.ORIGINAL_CLAIMS,
    );
  }

  if (currentlyLoggedIn && missingInformation) {
    return (
      <div className="usa-grid full-page-alert">
        <AlertBox
          isVisible
          headline="We’re sorry. It looks like we’re missing some information needed for your application"
          content="For help with your application, please call Veterans Benefits Assistance at 800-827-1000, Monday – Friday, 8:00 a.m. to 9:00 p.m. ET."
          status="error"
        />
      </div>
    );
  }

  let serviceRequired = backendServices.FORM526;
  if (!environment.isProduction()) {
    serviceRequired = [
      backendServices.FORM526,
      backendServices.ORIGINAL_CLAIMS,
    ];
  }

  return (
    <RequiredLoginView serviceRequired={serviceRequired} user={user} verify>
      {children}
    </RequiredLoginView>
  );
}

const mapStateToProps = store => ({
  user: store.user,
});

export default connect(mapStateToProps)(RequiredServicesGate);
