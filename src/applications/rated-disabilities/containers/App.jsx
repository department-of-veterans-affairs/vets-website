import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DowntimeNotification, {
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import AppContent from '../components/AppContent';
import MVIError from '../components/MVIError';
import { useBrowserMonitoring } from '../util/datadog-rum/useBrowserMonitoring';

const App = props => {
  const { loggedIn, user } = props;

  // Add Datadog UX monitoring to the application
  useBrowserMonitoring({
    loggedIn,
    version: '1.0.3',
    applicationId: 'ec980bd9-5d61-4cf7-88a8-bdbbdb015059',
    clientToken: 'pub7162d18113213637d731bd1ae8a0abf0',
    service: 'benefits-rated-disabilities',
    sessionSampleRate: environment.vspEnvironment() !== 'production' ? 100 : 10,
    sessionReplaySampleRate:
      environment.vspEnvironment() !== 'production' ? 100 : 20,
  });

  return (
    <RequiredLoginView
      serviceRequired={backendServices.USER_PROFILE}
      user={user}
    >
      <DowntimeNotification
        appTitle="Rated Disabilities"
        dependencies={[
          externalServices.evss,
          externalServices.global,
          externalServices.mvi,
          externalServices.vaProfile,
          externalServices.vbms,
        ]}
      >
        {!user.profile.verified || user.profile.status !== 'OK' ? (
          <MVIError />
        ) : (
          <AppContent />
        )}
      </DowntimeNotification>
    </RequiredLoginView>
  );
};

App.propTypes = {
  loggedIn: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  loggedIn: isLoggedIn(state),
  user: state.user,
});

export default connect(
  mapStateToProps,
  null,
)(App);

export { App };
