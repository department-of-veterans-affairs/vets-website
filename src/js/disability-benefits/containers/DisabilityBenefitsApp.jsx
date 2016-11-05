import React from 'react';
import { connect } from 'react-redux';

import ClaimsUnavailable from '../components/ClaimsUnavailable';
import ClaimSyncWarning from '../components/ClaimSyncWarning';
import RequiredLoginView from '../../common/components/RequiredLoginView';

class DisabilityBenefitsApp extends React.Component {

  render() {
    const { available, synced } = this.props;

    return (
      <RequiredLoginView authRequired={3} serviceRequired={"disability-benefits"}>
        <div className="disability-benefits-content">
          {available && !synced
            ? <ClaimSyncWarning/>
            : null}
          {available
            ? <div>
              {this.props.children}
            </div>
            : <div className="row"><div className="columns medium-8"><ClaimsUnavailable/></div></div>}
        </div>
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

export { DisabilityBenefitsApp };
