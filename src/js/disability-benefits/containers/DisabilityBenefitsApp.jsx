import React from 'react';
import { connect } from 'react-redux';

import ClaimsUnavailable from '../components/ClaimsUnavailable';
import MviRecordsUnavailable from '../components/MviRecordsUnavailable';
import AskVAQuestions from '../components/AskVAQuestions';
import ClaimsUnauthorized from '../components/ClaimsUnauthorized';
import RequiredLoginView from '../../common/components/RequiredLoginView';

const unavailableView = (
  <div className="row">
    <div className="columns usa-width-two-thirds medium-8"><ClaimsUnavailable/></div>
    <div className="columns usa-width-one-third medium-4"><AskVAQuestions/></div>
  </div>
);

const unavailableMviRecords = (
  <div className="row">
    <div className="columns usa-width-two-thirds medium-8"><MviRecordsUnavailable/></div>
    <div className="columns usa-width-one-third medium-4"><AskVAQuestions/></div>
  </div>
);

// This needs to be a React component for RequiredLoginView to pass down
// the isDataAvailable prop, which is only passed on failure.
function AppContent({ authorized, available, children, isDataAvailable }) {
  const canUseApp = isDataAvailable === true || typeof isDataAvailable === 'undefined';
  return (
    <div className="disability-benefits-content">
      {!authorized && <div className="row"><div className="columns usa-width-two-thirds medium-8"><ClaimsUnauthorized/></div></div>}
      {authorized && !available && unavailableView}
      {authorized && !canUseApp && available && unavailableMviRecords}
      {available && authorized && canUseApp &&
        <div>
          {children}
        </div>}
    </div>
  );
}

class DisabilityBenefitsApp extends React.Component {
  render() {
    const { available, authorized } = this.props;

    return (
      <RequiredLoginView
          authRequired={3}
          serviceRequired={"evss-claims"}
          userProfile={this.props.profile}
          loginUrl={this.props.loginUrl}
          verifyUrl={this.props.verifyUrl}>
        <AppContent
            authorized={authorized}
            available={available}>
          {this.props.children}
        </AppContent>
      </RequiredLoginView>
    );
  }
}

function mapStateToProps(state) {
  const claimsState = state.disability.status;
  const userState = state.user;
  return {
    available: claimsState.claimSync.available,
    authorized: claimsState.claimSync.authorized,
    profile: userState.profile,
    loginUrl: userState.login.loginUrl,
    verifyUrl: userState.login.verifyUrl
  };
}

export default connect(mapStateToProps)(DisabilityBenefitsApp);

export { DisabilityBenefitsApp, AppContent };
