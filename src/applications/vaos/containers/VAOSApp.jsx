import * as Sentry from '@sentry/browser';
import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { selectUser } from 'platform/user/selectors';
import backendServices from 'platform/user/profile/constants/backendServices';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';

import {
  vaosApplication,
  selectFeatureToggleLoading,
} from '../utils/selectors';
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
    const {
      user,
      children,
      showApplication,
      loadingFeatureToggles,
    } = this.props;

    if (this.state.hasError) {
      return (
        <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
          <div className="vads-l-row">
            <div className="vads-l-col--12 medium-screen:vads-l-col--8 vads-u-margin-bottom--4">
              <ErrorMessage />
            </div>
          </div>
        </div>
      );
    }

    return (
      <RequiredLoginView
        serviceRequired={[
          backendServices.USER_PROFILE,
          backendServices.FACILITIES,
        ]}
        user={user}
        verify
      >
        {loadingFeatureToggles && (
          <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
            <div className="vads-l-row">
              <div className="vads-l-col--12 medium-screen:vads-l-col--8 vads-u-margin-bottom--4">
                <LoadingIndicator />
              </div>
            </div>
          </div>
        )}
        {!loadingFeatureToggles &&
          showApplication && (
            <DowntimeNotification
              appTitle="VA online scheduling"
              dependencies={[externalServices.mvi, externalServices.vaos]}
            >
              <RegistrationCheck>{children}</RegistrationCheck>
            </DowntimeNotification>
          )}
        {!loadingFeatureToggles && !showApplication && <AppUnavailable />}
      </RequiredLoginView>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: selectUser(state),
    showApplication: vaosApplication(state),
    loadingFeatureToggles: selectFeatureToggleLoading(state),
  };
}

export default connect(mapStateToProps)(VAOSApp);
