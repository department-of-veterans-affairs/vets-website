import React from 'react';
import { connect } from 'react-redux';

import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { RequiredLoginView } from 'platform/user/authorization/components/RequiredLoginView';
import backendServices from 'platform/user/profile/constants/backendServices';

export function EducationGate({ user, location, children }) {
  // Short-circuit the check on the intro page
  if (location.pathname === '/introduction') {
    return children;
  }

  if (
    user.login.currentlyLoggedIn &&
    !user.profile.services.includes(backendServices.EDUCATION_BENEFITS)
  ) {
    return (
      <div className="usa-grid full-page-alert">
        <VaAlert visible status="error">
          <h3 slot="headline">
            We’re sorry. It looks like we’re missing some information needed for
            your application
          </h3>
          For help with your application, please call Veterans Benefits
          Assistance at 800-827-1000, Monday – Friday, 8:00 a.m. to 9:00 p.m.
          ET.
        </VaAlert>
      </div>
    );
  }

  return (
    <RequiredLoginView
      serviceRequired={backendServices.USER_PROFILE}
      user={user}
    >
      {children}
    </RequiredLoginView>
  );
}

const mapStateToProps = store => ({
  user: store.user,
});

export default connect(mapStateToProps)(EducationGate);
