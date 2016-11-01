import React from 'react';
import { connect } from 'react-redux';

import ClaimsUnavailable from '../components/ClaimsUnavailable';
import ClaimSyncWarning from '../components/ClaimSyncWarning';
import RequiredLoginView from '../../common/components/RequiredLoginView';

class DisabilityBenefitsApp extends React.Component {

  render() {
    const { available, synced, syncedDate } = this.props;
    const view = (
      <div>
        {available && !synced
          ? <ClaimSyncWarning syncedDate={syncedDate}/>
          : null}
        {available
          ? <div>
            {this.props.children}
          </div>
          : <div className="row"><div className="columns medium-8"><ClaimsUnavailable/></div></div>}
      </div>
    );

    return (
      <RequiredLoginView authRequired={3} component={view}/>
    );
  }

}

function mapStateToProps(state) {
  return {
    available: state.claimSync.available,
    synced: state.claimSync.synced,
    syncedDate: state.claimSync.syncedDate
  };
}

export default connect(mapStateToProps)(DisabilityBenefitsApp);

export { DisabilityBenefitsApp };
