import React from 'react';
import { connect } from 'react-redux';

import ClaimsUnavailable from '../components/ClaimsUnavailable';
import MviRecordsUnavailable from '../components/MviRecordsUnavailable';
import AskVAQuestions from '../components/AskVAQuestions';
import ClaimsUnauthorized from '../components/ClaimsUnauthorized';
import ClaimSyncWarning from '../components/ClaimSyncWarning';
import RequiredLoginView from '../../common/components/RequiredLoginView';

const unavailableView = (
  <div className="usa-grid">
    <div className="usa-width-two-thirds"><ClaimsUnavailable/></div>
    <div className="usa-width-one-third"><AskVAQuestions/></div>
  </div>
);

const unavailableMviRecords = (
  <div className="usa-grid">
    <div className="usa-width-two-thirds"><MviRecordsUnavailable/></div>
    <div className="usa-width-one-third"><AskVAQuestions/></div>
  </div>
);

// this needs to be a React component for RequiredLoginView to pass down props
function AppContent({ authorized, available, synced, children, isDataAvailable }) {
  // prop is only passed on failure
  const canUseApp = isDataAvailable === true || typeof isDataAvailable === 'undefined';
  return (
    <div className="disability-benefits-content">
      {available && authorized && canUseApp && !synced && <ClaimSyncWarning/>}
      {!authorized && <div className="usa-grid"><div className="usa-width-two-thirds"><ClaimsUnauthorized/></div></div>}
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
    const { available, synced, authorized } = this.props;

    return (
      <RequiredLoginView authRequired={3} serviceRequired={"disability-benefits"}>
        <AppContent
            authorized={authorized}
            available={available}
            synced={synced}>
          {this.props.children}
        </AppContent>
      </RequiredLoginView>
    );
  }
}

function mapStateToProps(state) {
  const claimsState = state.disability.status;
  return {
    available: claimsState.claimSync.available,
    synced: claimsState.claimSync.synced,
    authorized: claimsState.claimSync.authorized
  };
}

export default connect(mapStateToProps)(DisabilityBenefitsApp);

export { DisabilityBenefitsApp, AppContent };
