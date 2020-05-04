import React from 'react';
import { connect } from 'react-redux';

import backendServices from 'platform/user/profile/constants/backendServices';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';

function IDCardBetaEnrollment({ user, children }) {
  return (
    <div>
      <RequiredLoginView
        serviceRequired={backendServices.USER_PROFILE}
        user={user}
      >
        {children}
      </RequiredLoginView>
    </div>
  );
}

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps)(IDCardBetaEnrollment);
export { IDCardBetaEnrollment };
