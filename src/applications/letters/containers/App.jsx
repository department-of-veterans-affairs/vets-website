import React from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom-v5-compat';
import { connect } from 'react-redux';

import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import { externalServices } from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { DowntimeBanner } from '@department-of-veterans-affairs/platform-monitoring/exports';

import AppContent from '../components/AppContent';
import { isLoadingFeatures } from '../selectors';

export function App({ featureFlagsLoading, user }) {
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

App.propTypes = {
  featureFlagsLoading: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  featureFlagsLoading: isLoadingFeatures(state),
  user: state.user,
});

export default connect(mapStateToProps)(App);
