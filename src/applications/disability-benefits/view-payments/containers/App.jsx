import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { RequiredLoginView } from 'platform/user/authorization/components/RequiredLoginView';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import backendServices from 'platform/user/profile/constants/backendServices';
import ViewPaymentsLists from '../components/view-payments-lists/ViewPaymentsLists';

function ViewPaymentsApp(props) {
  const headerRef = useCallback(node => {
    node?.focus();
  }, []);

  return (
    <RequiredLoginView
      serviceRequired={backendServices.USER_PROFILE}
      user={props.user}
    >
      <DowntimeNotification
        appTitle="VA Payment History"
        dependencies={[
          externalServices.bgs,
          externalServices.global,
          externalServices.mvi,
          externalServices.vaProfile,
          externalServices.vbms,
        ]}
      >
        <div>
          <div className="vads-l-grid-container vads-u-padding--0">
            <div className="vads-l-row">
              <div className="vads-l-col--12 medium-screen:vads-l-col--12 large-screen:vads-l-col--12 vads-u-padding--1p5 desktop-lg:vads-u-padding--0">
                <h1
                  ref={headerRef}
                  className="your-va-payments-header"
                  tabIndex="-1"
                >
                  Your VA payments
                </h1>
                <ViewPaymentsLists />
              </div>
            </div>
          </div>
        </div>
      </DowntimeNotification>
    </RequiredLoginView>
  );
}

const mapStateToProps = state => ({
  user: state.user,
});

ViewPaymentsApp.propTypes = {
  user: PropTypes.object,
};

export default connect(mapStateToProps)(ViewPaymentsApp);
export { ViewPaymentsApp };
