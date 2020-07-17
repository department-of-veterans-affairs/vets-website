import React from 'react';
import * as Sentry from '@sentry/browser';
import { connect } from 'react-redux';

import backendServices from 'platform/user/profile/constants/backendServices';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import DowntimeBanner from 'platform/monitoring/DowntimeNotification/components/Banner';
import CallVBACenter from 'platform/static-data/CallVBACenter';

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
    const unregistered = this.props.isDataAvailable === false;
    let view;

    if (unregistered) {
      view = (
        <h4>
          We weren’t able to find information about your VA letters. If you
          think you should be able to access this information, please{' '}
          <CallVBACenter />
        </h4>
      );
    } else {
      view = this.props.children;
    }

    return <div className="usa-grid">{view}</div>;
  }
}

export function LettersApp({ user, children }) {
  return (
    <RequiredLoginView
      verify
      serviceRequired={backendServices.EVSS_CLAIMS}
      user={user}
    >
      <AppContent>
        <DowntimeBanner
          appTitle="Letters Generator"
          dependencies={[externalServices.evss]}
        />
        <div>{children}</div>
      </AppContent>
    </RequiredLoginView>
  );
}

function mapStateToProps(state) {
  return { user: state.user };
}

export default connect(mapStateToProps)(LettersApp);
