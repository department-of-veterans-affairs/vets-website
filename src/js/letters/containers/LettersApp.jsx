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
        To view and download your VA letters, you need to verify your identity (or whatever).
      </h4>
    );
  } else {
    view = children;
  }

  return (
    <div className="usa-grid">
      {view}
    </div>
  );
}

class LettersApp extends React.Component {
  render() {
    return (
      <RequiredLoginView
          authRequired={3}
          serviceRequired={"evss-claims"}
          userProfile={this.props.profile}
          loginUrl={this.props.loginUrl}
          verifyUrl={this.props.verifyUrl}>
        <AppContent>
          <div className="usa-width-three-fourths">
            {this.props.children}
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

export default connect(mapStateToProps)(LettersApp);
