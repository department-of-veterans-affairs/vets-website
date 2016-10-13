import React from 'react';
import { connect } from 'react-redux';
import ClaimDetailLayout from '../components/ClaimDetailLayout';

class DetailsPage extends React.Component {
  render() {
    const { claim, loading } = this.props;

    return (
      <ClaimDetailLayout
          claim={claim}
          loading={loading}>
        <div className="claim-details">
          <div className="claim-types">
            <h6>Claim Type</h6>
            <p>{"Disability Compensation"}</p>
          </div>
          <div className="claim-conditions-list">
            <h6>Your Claimed Conditions</h6>
            <li>{"Tinnitus"} {"(new)"}</li>
            <li>{"PTSD"} {"(reopened)"}</li>
            <li>{"Diabetes"} {"(increase)"}</li>
          </div>
          <div className="claim-date-recieved">
            <h6>Date Recieved</h6>
            <p>{"Jun 12, 2016"}</p>
          </div>
          <div className="claim-va-representative">
            <h6>Your Representative for VA Claims</h6>
            <p>{"Disabled American Veterans"}</p>
          </div>
        </div>
      </ClaimDetailLayout>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.claimDetail.loading,
    claim: state.claimDetail.detail
  };
}

export default connect(mapStateToProps)(DetailsPage);

export { DetailsPage };
