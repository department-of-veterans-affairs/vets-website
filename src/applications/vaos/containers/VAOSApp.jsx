import React from 'react';
import { connect } from 'react-redux';

import { selectUser } from 'platform/user/selectors';
import backendServices from 'platform/user/profile/constants/backendServices';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';

import { vaosApplication } from '../utils/selectors';
import RegistrationCheck from './RegistrationCheck';
import AppUnavailable from '../components/AppUnavailable';

export function VAOSApp({ user, children, showApplication }) {
  return (
    <RequiredLoginView
      authRequired={1}
      serviceRequired={[
        backendServices.USER_PROFILE,
        backendServices.FACILITIES,
      ]}
      user={user}
    >
      {showApplication && (
        <DowntimeNotification
          appTitle="VA online scheduling"
          dependencies={[externalServices.mvi, externalServices.vaos]}
        >
          <RegistrationCheck>{children}</RegistrationCheck>
        </DowntimeNotification>
      )}
      {!showApplication && <AppUnavailable />}
    </RequiredLoginView>
  );
}

function mapStateToProps(state) {
  return {
    user: selectUser(state),
    showApplication: vaosApplication(state),
  };
}

export default connect(mapStateToProps)(VAOSApp);
