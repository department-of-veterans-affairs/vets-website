import React from 'react';
import { connect } from 'react-redux';

import ClaimsUnavailable from '../components/ClaimsUnavailable';
import ClaimSyncWarning from '../components/ClaimSyncWarning';
import RequiredLoginView from '../../common/components/RequiredLoginView';

// this needs to be a React component for RequiredLoginView to pass down props
function AppContent({ available, synced, children, isDataAvailable }) {
  // prop is only passed on failure
  const canUseApp = isDataAvailable === true || typeof isDataAvailable === 'undefined';
  return (
    <div className="disability-benefits-content">
      {available && canUseApp && !synced
        ? <ClaimSyncWarning/>
        : null}
      {available && canUseApp
        ? <div>
          {children}
        </div>
        : <div className="row"><div className="columns medium-8"><ClaimsUnavailable/></div></div>}
    </div>
  );
}

class DisabilityBenefitsApp extends React.Component {
  render() {
    const { available, synced } = this.props;

    return (
      <RequiredLoginView authRequired={3} serviceRequired={"disability-benefits"}>
        <AppContent
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
    synced: state.claimSync.synced
  };
}

export default connect(mapStateToProps)(DisabilityBenefitsApp);

export { DisabilityBenefitsApp, AppContent };
