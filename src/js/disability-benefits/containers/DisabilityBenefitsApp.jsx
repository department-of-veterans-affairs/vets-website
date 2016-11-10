import React from 'react';
import { connect } from 'react-redux';

import ClaimsUnavailable from '../components/ClaimsUnavailable';
import ClaimSyncWarning from '../components/ClaimSyncWarning';
import RequiredLoginView from '../../common/components/RequiredLoginView';
import ClaimsUnauthorized from '../components/ClaimsUnauthorized';

class DisabilityBenefitsApp extends React.Component {

  render() {
    const { available, synced, authorized } = this.props;

    return (
      <RequiredLoginView authRequired={3} serviceRequired={"disability-benefits"}>
        <div className="disability-benefits-content">
          {available && authorized && !synced
            ? <ClaimSyncWarning/>
            : null}
          {!authorized && <div className="row"><div className="columns medium-8"><ClaimsUnauthorized/></div></div>}
          {authorized && !available && <div className="row"><div className="columns medium-8"><ClaimsUnavailable/></div></div>}
          {available && authorized &&
            <div>
              {this.props.children}
            </div>}
        </div>
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

export { DisabilityBenefitsApp };
