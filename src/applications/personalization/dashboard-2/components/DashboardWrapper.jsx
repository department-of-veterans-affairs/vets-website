import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { selectShowDashboard2 } from '../selectors';

const DashboardV1 = React.lazy(() => {
  return import(/* webpackChunkName: "dashboard-1" */ '../../dashboard/components/Dashboard');
});
const DashboardV2 = React.lazy(() => {
  return import(/* webpackChunkName: "dashboard-2" */ './Dashboard');
});

// The root component for the My VA Dashboard app that lives at /my-va
//
// Its only responsibility is to determine if the user should see Dashboard v1
// or Dashboard v2 based on the value of the Dashboard v2 feature flag and/or
// the value of  'DASHBOARD_VERSION' in the browser's local storage.
//
// The 'DASHBOARD_VERSION' local storage value will override the value of the
// feature flag.
function DashboardWrapper({ showDashboard2, rootUrl }) {
  const loader = (
    <div className="vads-u-margin-y--4 vads-u-padding-y--0p5">
      <LoadingIndicator message="Please wait while we load the application for you." />
    </div>
  );
  const content = showDashboard2 ? (
    <DashboardV2 />
  ) : (
    <DashboardV1 rootUrl={rootUrl} />
  );
  return <Suspense fallback={loader}>{content}</Suspense>;
}

DashboardWrapper.propTypes = {
  rootUrl: PropTypes.string,
  // From mapStateToProps.
  showDashboard2: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  showDashboard2: selectShowDashboard2(state),
});

export default connect(mapStateToProps)(DashboardWrapper);
