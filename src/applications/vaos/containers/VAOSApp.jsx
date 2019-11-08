import React from 'react';
import { connect } from 'react-redux';

import { selectUser } from 'platform/user/selectors';
import backendServices from 'platform/user/profile/constants/backendServices';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import RegistrationCheck from './RegistrationCheck';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';

export function VAOSApp({ user, children }) {
  return (
    <RequiredLoginView
      authRequired={1}
      serviceRequired={[
        backendServices.USER_PROFILE,
        backendServices.FACILITIES,
      ]}
      user={user}
    >
      <DowntimeNotification
        appTitle="VA online scheduling"
        dependencies={[externalServices.mvi, externalServices.vaos]}
      >
        <RegistrationCheck>{children}</RegistrationCheck>
      </DowntimeNotification>
    </RequiredLoginView>
  );
}

function mapStateToProps(state) {
  return {
    user: selectUser(state),
  };
}

export default connect(mapStateToProps)(VAOSApp);
