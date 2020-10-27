import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import localStorage from 'platform/utilities/storage/localStorage';
import { selectShowDashboard2 } from '../selectors';

const DashboardV1 = React.lazy(() => {
  return import('../../dashboard/components/Dashboard');
});
const DashboardV2 = React.lazy(() => {
  return import('./Dashboard');
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

const mapStateToProps = state => {
  const LSDashboardVersion = localStorage.getItem('DASHBOARD_VERSION');
  const LSDashboard1 = LSDashboardVersion === '1';
  const LSDashboard2 = LSDashboardVersion === '2';
  const FFDashboard2 = selectShowDashboard2(state);
  return {
    showDashboard2: LSDashboard2 || (FFDashboard2 && !LSDashboard1),
  };
};

export default connect(mapStateToProps)(DashboardWrapper);
