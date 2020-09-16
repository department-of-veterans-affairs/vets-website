import React from 'react';
import { connect } from 'react-redux';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import backendServices from 'platform/user/profile/constants/backendServices';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import ViewPaymentsLists from '../components/view-payments-lists/ViewPaymentsLists.jsx';
import ViewPaymentsSidebar from '../components/ViewPaymentsSidebar/ViewPaymentsSidebar.jsx';
import ViewPaymentsSidebarBlock from '../components/ViewPaymentsSidebar/ViewPaymentsSidebarBlock.jsx';
import {
  firstSidebarBlock,
  secondSidebarBlock,
  thirdSidebarBlock,
} from '../components/ViewPaymentsSidebar/ViewPaymentsSidebarBlockStates/ViewPaymentsSidebarBlockStates.jsx';

function ViewPaymentsApp(props) {
  return (
    <RequiredLoginView
      serviceRequired={backendServices.USER_PROFILE}
      user={props.user}
    >
      <DowntimeNotification
        appTitle="VA Payment History"
        dependencies={[externalServices.bgs]}
      >
        <div>
          <div className="vads-l-grid-container vads-u-padding--0">
            <div className="vads-l-row">
              <div className="vads-l-col--12 medium-screen:vads-l-col--12 large-screen:vads-l-col--8 vads-u-padding--1p5 large-screen:vads-u-padding--0">
                <h1>Your VA payments</h1>
                <ViewPaymentsLists />
              </div>
              <div className="vads-l-col--12 medium-screen:vads-l-col--12 large-screen:vads-l-col--4">
                <ViewPaymentsSidebar>
                  <ViewPaymentsSidebarBlock
                    heading={firstSidebarBlock.heading}
                    content={firstSidebarBlock.content}
                  />
                  <ViewPaymentsSidebarBlock
                    heading={secondSidebarBlock.heading}
                    content={secondSidebarBlock.content}
                  />
                  <ViewPaymentsSidebarBlock
                    heading={thirdSidebarBlock.heading}
                    content={thirdSidebarBlock.content}
                  />
                </ViewPaymentsSidebar>
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

export default connect(mapStateToProps)(ViewPaymentsApp);
export { ViewPaymentsApp };
