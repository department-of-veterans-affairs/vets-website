import React from 'react';
import * as Sentry from '@sentry/browser';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom-v5-compat';

import backendServices from 'platform/user/profile/constants/backendServices';
import { RequiredLoginView } from 'platform/user/authorization/components/RequiredLoginView';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import DowntimeBanner from 'platform/monitoring/DowntimeNotification/components/Banner';
import CallVBACenter from 'platform/static-data/CallVBACenter';
import { isLoadingFeatures } from '../selectors';

const UNREGISTERED_ERROR = 'vets_letters_user_unregistered';

// This needs to be a React component for RequiredLoginView to pass down
// the isDataAvailable prop, which is only passed on failure.
export class AppContent extends React.Component {
  constructor(props) {
    super(props);
    if (props.isDataAvailable === false) {
      Sentry.captureException(new Error(UNREGISTERED_ERROR));
      this.state = { errorLogged: true };
    } else {
      this.state = { errorLogged: false };
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    // only log isDataAvailable error if one isn't already logged
    if (nextProps.isDataAvailable === false && !this.state.errorLogged) {
      Sentry.captureException(new Error(UNREGISTERED_ERROR));
      this.setState({ errorLogged: true });
    }
  }

  render() {
    if (this.props.isDataAvailable === false) {
      return (
        <div className="usa-grid">
          <h1>VA letters and documents</h1>
          <va-alert status="error">
            We weren’t able to find information about your VA letters. If you
            think you should be able to access this information, please{' '}
            <CallVBACenter />
          </va-alert>
          <p className="vads-u-margin-bottom--4" />
        </div>
      );
    }

    if (!this.props.featureFlagsLoading) {
      return (
        <div data-testid="appContentChildren" className="usa-grid">
          {this.props.children}
        </div>
      );
    }
    return (
      <div className="vads-u-margin-y--5">
        <va-loading-indicator
          data-testid="feature-flags-loading"
          message="Loading your information..."
        />
      </div>
    );
  }
}

export function LettersApp({ user, featureFlagsLoading }) {
  return (
    <RequiredLoginView
      serviceRequired={backendServices.EVSS_CLAIMS}
      user={user}
      verify
    >
      <AppContent featureFlagsLoading={featureFlagsLoading}>
        <DowntimeBanner
          appTitle="Letters Generator"
          dependencies={[externalServices.evss]}
        />
        <Outlet />
      </AppContent>
    </RequiredLoginView>
  );
}

AppContent.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
  isDataAvailable: PropTypes.bool,
};

LettersApp.propTypes = {
  featureFlagsLoading: PropTypes.bool,
  user: PropTypes.shape({}),
};

function mapStateToProps(state) {
  return {
    featureFlagsLoading: isLoadingFeatures(state),
    user: state.user,
  };
}

export default connect(mapStateToProps)(LettersApp);
