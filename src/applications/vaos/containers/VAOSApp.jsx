import * as Sentry from '@sentry/browser';
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
import ErrorMessage from '../components/ErrorMessage';

export class VAOSApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    Sentry.captureException(error);
  }

  render() {
    const { user, children, showApplication } = this.props;

    if (this.state.hasError) {
      return (
        <div className="vads-u-margin-y--2">
          <ErrorMessage />
        </div>
      );
    }

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
}

function mapStateToProps(state) {
  return {
    user: selectUser(state),
    showApplication: vaosApplication(state),
  };
}

export default connect(mapStateToProps)(VAOSApp);
