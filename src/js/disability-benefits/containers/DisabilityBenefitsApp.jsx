import React from 'react';
import { connect } from 'react-redux';

import ClaimsUnavailable from '../components/ClaimsUnavailable';
import ClaimsUnauthorized from '../components/ClaimsUnauthorized';
import ClaimSyncWarning from '../components/ClaimSyncWarning';
import RequiredLoginView from '../../common/components/RequiredLoginView';

// this needs to be a React component for RequiredLoginView to pass down props
function AppContent({ authorized, available, synced, children, isDataAvailable }) {
  // prop is only passed on failure
  const canUseApp = isDataAvailable === true || typeof isDataAvailable === 'undefined';
  return (
    <div className="disability-benefits-content">
      {available && authorized && canUseApp && !synced && <ClaimSyncWarning/>}
      {!authorized && <div className="row"><div className="columns medium-8"><ClaimsUnauthorized/></div></div>}
      {authorized && (!available || !canUseApp) && <div className="row"><div className="columns medium-8"><ClaimsUnavailable/></div></div>}
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
  return {
    available: state.claimSync.available,
    synced: state.claimSync.synced,
    authorized: state.claimSync.authorized
  };
}

export default connect(mapStateToProps)(DisabilityBenefitsApp);

export { DisabilityBenefitsApp, AppContent };
