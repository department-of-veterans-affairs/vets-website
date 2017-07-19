import React from 'react';
import { connect } from 'react-redux';

import RequiredLoginView from '../../common/components/RequiredLoginView';

// This needs to be a React component for RequiredLoginView to pass down
// the isDataAvailable prop, which is only passed on failure.
function AppContent({ children, isDataAvailable }) {
  const unregistered = isDataAvailable === false;
  let view;

  if (unregistered) {
    view = (
      <h4>
        We weren't able to find information about your Post-9/11 GI Bill Benefit Status.
        If you think you should be able to access this information, please call the Vets.gov Help Desk at 855-574-7286 (TTY: 800-829-4833). We're here Monday–Friday, 8:00 a.m.–8:00 p.m. (ET).
      </h4>
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
          serviceRequired={"evss-claims"}
          userProfile={this.props.profile}
          loginUrl={this.props.loginUrl}
          verifyUrl={this.props.verifyUrl}>
        <AppContent>
          <div className="row">
            <div className="small-12 columns">
              {this.props.children}
            </div>
          </div>
        </AppContent>
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
