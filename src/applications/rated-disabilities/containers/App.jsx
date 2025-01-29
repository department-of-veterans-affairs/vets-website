import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Outlet } from 'react-router-dom-v5-compat';

import DowntimeNotification, {
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';

// import AppContent from '../components/AppContent';
import MVIError from '../components/MVIError';

export function App({ user }) {
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
          <Outlet />
        )}
      </DowntimeNotification>
    </RequiredLoginView>
  );
}

App.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(
  mapStateToProps,
  null,
)(App);
