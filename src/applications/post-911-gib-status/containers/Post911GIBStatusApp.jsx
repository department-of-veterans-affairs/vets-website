import React from 'react';
import { connect } from 'react-redux';

import backendServices from '../../../platform/user/profile/constants/backendServices';
import RequiredLoginView from '../../../platform/user/authorization/components/RequiredLoginView';
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
            If none of the above situations applies to you, and you think your
            Statement of Benefits should be here, please call the GI Bill
            Hotline at <a href="tel:18884424551">888-442-4551</a>.
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
