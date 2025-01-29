import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DowntimeNotification, {
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';

import AppContent from '../components/AppContent';
import FeatureFlagsLoaded from '../components/FeatureFlagsLoaded';
import MVIError from '../components/MVIError';
import { isLoadingFeatures } from '../selectors';

const App = props => {
  const { featureFlagsLoading, user } = props;

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
          <FeatureFlagsLoaded featureFlagsLoading={featureFlagsLoading}>
            <AppContent />
          </FeatureFlagsLoaded>
        )}
      </DowntimeNotification>
    </RequiredLoginView>
  );
};

App.propTypes = {
  featureFlagsLoading: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  featureFlagsLoading: isLoadingFeatures(state),
  user: state.user,
});

export default connect(
  mapStateToProps,
  null,
)(App);

export { App };
