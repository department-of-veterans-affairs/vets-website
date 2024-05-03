import React from 'react';
import { connect } from 'react-redux';
import { Outlet } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';

// import DowntimeNotification, {
//   externalServices,
// } from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
// import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
// import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
// import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import { setLastPage } from '../actions';
// import { isLoadingFeatures } from '../selectors';

function AppContent({ isDataAvailable }) {
  const canUseApp =
    isDataAvailable === true || typeof isDataAvailable === 'undefined';

  if (canUseApp) {
    return (
      <div>
        <Outlet />
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

AppContent.propTypes = {
  children: PropTypes.node,
  featureFlagsLoading: PropTypes.bool,
  isDataAvailable: PropTypes.bool,
};

function FormUploadApp({ featureFlagsLoading }) {
  // const { pathname } = useLocation();
  // useEffect(
  //   () => {
  //     dispatchSetLastPage(pathname);
  //   },
  //   [pathname],
  // );

  return (
    // <RequiredLoginView
    //   verify
    //   serviceRequired={[
    //     backendServices.EVSS_CLAIMS,
    //     backendServices.APPEALS_STATUS,
    //     backendServices.LIGHTHOUSE,
    //   ]}
    //   user={user}
    // >
    //   <div id="downtime-app">
    //     <DowntimeNotification
    //       appTitle="Claim Status"
    //       dependencies={[
    //         externalServices.evss,
    //         externalServices.global,
    //         externalServices.mvi,
    //         externalServices.vaProfile,
    //         externalServices.vbms,
    //       ]}
    //     >
    <AppContent featureFlagsLoading={featureFlagsLoading} />
    //     </DowntimeNotification>
    //   </div>
    // </RequiredLoginView>
  );
}

FormUploadApp.propTypes = {
  dispatchSetLastPage: PropTypes.func,
  featureFlagsLoading: PropTypes.bool,
  loggedIn: PropTypes.bool,
  user: PropTypes.object,
};

function mapStateToProps() {
  // const featureFlagsLoading = isLoadingFeatures(state);

  return {
    // featureFlagsLoading,
    // loggedIn: isLoggedIn(state),
    // user: state.user,
  };
}

const mapDispatchToProps = {
  dispatchSetLastPage: setLastPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormUploadApp);

export { AppContent, FormUploadApp };
