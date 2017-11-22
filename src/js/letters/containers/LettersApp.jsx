import React from 'react';
import { connect } from 'react-redux';

import RequiredLoginView from '../../common/components/RequiredLoginView';

// This needs to be a React component for RequiredLoginView to pass down
// the isDataAvailable prop, which is only passed on failure.
export function AppContent({ children, isDataAvailable }) {
  const unregistered = isDataAvailable === false;
  let view;

  if (unregistered) {
    view = (
      <h4>
        We weren’t able to find information about your VA letters.
        If you think you should be able to access this information, please call the Vets.gov Help Desk at <a href="tel:855-574-7286">1-855-574-7286</a>, TTY: <a href="tel:18008778339">1-800-877-8339</a>, Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET).
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

export class LettersApp extends React.Component {
  render() {
    return (
      <RequiredLoginView
        authRequired={3}
        serviceRequired="evss-claims"
        userProfile={this.props.profile}
        loginUrl={this.props.loginUrl}
        verifyUrl={this.props.verifyUrl}>
        <AppContent>
          <div>
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
