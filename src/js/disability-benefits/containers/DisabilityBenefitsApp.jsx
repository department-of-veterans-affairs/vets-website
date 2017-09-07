import React from 'react';
import { connect } from 'react-redux';

import RequiredLoginView from '../../common/components/RequiredLoginView';
import ClaimsAppealsUnavailable from '../components/ClaimsAppealsUnavailable';

// This needs to be a React component for RequiredLoginView to pass down
// the isDataAvailable prop, which is only passed on failure.
function AppContent({ children, isDataAvailable }) {
  const canUseApp = isDataAvailable === true || typeof isDataAvailable === 'undefined';
  return (
    <div className="disability-benefits-content">
      {!canUseApp && <ClaimsAppealsUnavailable/>}
      {canUseApp &&
        <div>
          {children}
        </div>}
    </div>
  );
}

class DisabilityBenefitsApp extends React.Component {
  render() {
    return (
      <RequiredLoginView
        authRequired={3}
        serviceRequired={['evss-claims', 'appeals-status']}
        userProfile={this.props.profile}
        loginUrl={this.props.loginUrl}
        verifyUrl={this.props.verifyUrl}>
        <AppContent>
          {this.props.children}
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

export default connect(mapStateToProps)(DisabilityBenefitsApp);

export { DisabilityBenefitsApp, AppContent };
