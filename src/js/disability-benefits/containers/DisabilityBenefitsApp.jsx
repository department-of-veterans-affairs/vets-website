import React from 'react';
import { connect } from 'react-redux';

import ClaimsUnavailable from '../components/ClaimsUnavailable';
import ClaimSyncWarning from '../components/ClaimSyncWarning';
import FeaturesWarning from '../components/FeaturesWarning';

class DisabilityBenefitsApp extends React.Component {

  render() {
    const { available, synced, syncedDate } = this.props;
    const isListPage = this.props.location.pathname === '/your-claims';
    return (
      <div>
        {available && !synced
          ? <ClaimSyncWarning syncedDate={syncedDate}/>
          : null}
        {available && synced && isListPage
          ? <FeaturesWarning/>
          : null}
        {available
          ? <div>
            {this.props.children}
          </div>
          : <div className="row"><div className="columns medium-8"><ClaimsUnavailable/></div></div>}
      </div>
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
