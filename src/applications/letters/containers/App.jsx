import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import { externalServices } from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { DowntimeBanner } from '@department-of-veterans-affairs/platform-monitoring/exports';

import AppContent from '../components/AppContent';
import { isLoadingFeatures } from '../selectors';

export function App({ children, featureFlagsLoading, user }) {
  return (
    <RequiredLoginView
      verify
      serviceRequired={backendServices.EVSS_CLAIMS}
      user={user}
    >
      <AppContent featureFlagsLoading={featureFlagsLoading}>
        <DowntimeBanner
          appTitle="Letters Generator"
          dependencies={[externalServices.evss]}
        />
        <div>{children}</div>
      </AppContent>
    </RequiredLoginView>
  );
}

App.propTypes = {
  children: PropTypes.node,
  featureFlagsLoading: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  featureFlagsLoading: isLoadingFeatures(state),
  user: state.user,
});

export default connect(mapStateToProps)(App);
