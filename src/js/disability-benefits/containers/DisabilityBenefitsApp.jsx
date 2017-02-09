import React from 'react';
import { connect } from 'react-redux';

import ClaimsUnavailable from '../components/ClaimsUnavailable';
import MviRecordsUnavailable from '../components/MviRecordsUnavailable';
import AskVAQuestions from '../components/AskVAQuestions';
import ClaimsUnauthorized from '../components/ClaimsUnauthorized';
import RequiredLoginView from '../../common/components/RequiredLoginView';

const unavailableView = (
  <div className="row">
    <div className="columns medium-8"><ClaimsUnavailable/></div>
    <div className="columns medium-4"><AskVAQuestions/></div>
  </div>
);

const unavailableMviRecords = (
  <div className="row">
    <div className="columns medium-8"><MviRecordsUnavailable/></div>
    <div className="columns medium-4"><AskVAQuestions/></div>
  </div>
);

// this needs to be a React component for RequiredLoginView to pass down props
function AppContent({ authorized, available, children, isDataAvailable }) {
  // prop is only passed on failure
  const canUseApp = isDataAvailable === true || typeof isDataAvailable === 'undefined';
  return (
    <div className="disability-benefits-content">
      {!authorized && <div className="row"><div className="columns medium-8"><ClaimsUnauthorized/></div></div>}
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
      <RequiredLoginView authRequired={3} serviceRequired={"disability-benefits"}>
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
  return {
    available: claimsState.claimSync.available,
    authorized: claimsState.claimSync.authorized
  };
}

export default connect(mapStateToProps)(DisabilityBenefitsApp);

export { DisabilityBenefitsApp, AppContent };
