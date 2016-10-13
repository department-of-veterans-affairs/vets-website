import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

class DisabilityBenefitsApp extends React.Component {

  render() {
    const { available, synced, syncedDate } = this.props;
    const updatedDate = moment(syncedDate).format('MMM D, YYYY');
    return (
      <div className="row">
        <div>
          {this.props.children}
        </div>
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
