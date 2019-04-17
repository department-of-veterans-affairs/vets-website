import React from 'react';
import { connect } from 'react-redux';

import backendServices from '../../../platform/user/profile/constants/backendServices';
import RequiredLoginView from '../../../platform/user/authorization/components/RequiredLoginView';
import CallHRC from '../../../platform/static-data/CallHRC';
import DowntimeNotification, {
  externalServices,
} from '../../../platform/monitoring/DowntimeNotification';

import Main from './Main';

// This needs to be a React component for RequiredLoginView to pass down
// the isDataAvailable prop, which is only passed on failure.
function AppContent({ children, isDataAvailable }) {
  const unregistered = isDataAvailable === false;
  let view;

  if (unregistered) {
    view = (
      <div className="row">
        <div className="small-12 columns">
          <h4>
            We weren’t able to find information about your Post-9/11 GI Bill
            Benefit Status. If you think you should be able to access this
            information, please <CallHRC />
          </h4>
          <br />
        </div>
      </div>
    );
  } else {
    view = children;
  }

  return <div>{view}</div>;
}

class Post911GIBStatusApp extends React.Component {
  render() {
    return (
      <RequiredLoginView
        verify
        serviceRequired={backendServices.EVSS_CLAIMS}
        user={this.props.user}
      >
        <DowntimeNotification
          appTitle="Post-9/11 GI Bill benefits tracking tool"
          dependencies={[externalServices.evss]}
        >
          <AppContent>
            <div className="row">
              <div className="small-12 columns">
                <Main>{this.props.children}</Main>
              </div>
            </div>
          </AppContent>
        </DowntimeNotification>
      </RequiredLoginView>
    );
  }
}

function mapStateToProps(state) {
  return { user: state.user };
}

export default connect(mapStateToProps)(Post911GIBStatusApp);
