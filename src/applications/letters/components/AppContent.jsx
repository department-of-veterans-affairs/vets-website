import React from 'react';
import * as Sentry from '@sentry/browser';
import PropTypes from 'prop-types';

import CallVBACenter from '@department-of-veterans-affairs/platform-static-data/CallVBACenter';

const UNREGISTERED_ERROR = 'vets_letters_user_unregistered';

// This needs to be a React component for RequiredLoginView to pass down
// the isDataAvailable prop, which is only passed on failure.
export default class AppContent extends React.Component {
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
          <va-alert status="error" uswds="false">
            We weren’t able to find information about your VA letters. If you
            think you should be able to access this information, please{' '}
            <CallVBACenter />
          </va-alert>
          <p className="vads-u-margin-bottom--4" />
        </div>
      );
    }

    if (!this.props.featureFlagsLoading) {
      return <div className="usa-grid">{this.props.children}</div>;
    }
    return (
      <div className="vads-u-margin-y--5">
        <va-loading-indicator
          data-testid="feature-flags-loading"
          message="Loading your information..."
          uswds="false"
        />
      </div>
    );
  }
}

AppContent.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  featureFlagsLoading: PropTypes.bool,
  isDataAvailable: PropTypes.bool,
};
