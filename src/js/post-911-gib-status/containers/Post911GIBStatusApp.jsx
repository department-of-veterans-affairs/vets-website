import React from 'react';
import { connect } from 'react-redux';

import RequiredLoginView from '../../common/components/RequiredLoginView';
import DowntimeNotification, { services } from '../../common/containers/DowntimeNotification';

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
            We weren’t able to find information about your Post-9/11 GI Bill Benefit Status.
            If you think you should be able to access this information, please call the Vets.gov Help Desk at <a href="tel:855-574-7286">1-855-574-7286</a>, TTY: <a href="tel:18008778339">1-800-877-8339</a>, Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET).
          </h4>
          <br/>
        </div>
      </div>
    );
  } else {
    view = children;
  }

  return (
    <div>
      {view}
    </div>
  );
}

class Post911GIBStatusApp extends React.Component {

  render() {
    return (
      <RequiredLoginView
        authRequired={3}
        serviceRequired="evss-claims"
        userProfile={this.props.profile}
        loginUrl={this.props.loginUrl}
        verifyUrl={this.props.verifyUrl}>
        <DowntimeNotification appTitle="Post-9/11 GI Bill benefits tracking tool" dependencies={[services.evss]}>
          <AppContent>
            <div className="row">
              <div className="small-12 columns">
                {this.props.children}
              </div>
            </div>
          </AppContent>
        </DowntimeNotification>
      </RequiredLoginView>
    );
  }
}

function mapStateToProps(state) {
  const userState = state.user;
  return {
    profile: userState.profile,
    loginUrl: userState.login.loginUrl,
    verifyUrl: userState.login.verifyUrl
  };
}

export default connect(mapStateToProps)(Post911GIBStatusApp);
