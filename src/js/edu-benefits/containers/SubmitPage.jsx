import React from 'react';
import { connect } from 'react-redux';
import SubmitMessage from '../components/SubmitMessage';

import { getListOfBenefits, getLabel } from '../utils/helpers';
import { relinquishableBenefits } from '../utils/options-for-select';

class SubmitPage extends React.Component {
  render() {
    const { relinquished, benefits, confirmation, address, timestamp } = this.props;

		// TODO: replace this with actual data from the API
    return (
      <SubmitMessage
          claimType="Education Benefits"
          confirmation={confirmation}
          date={timestamp}
          address={address}
          claimedBenefits={benefits}
          relinquishedBenefits={relinquished}/>
    );
  }
}

function mapStateToProps(state) {
  return {
    benefits: getListOfBenefits(state.veteran),
    relinquished: getLabel(relinquishableBenefits, state.veteran.benefitsRelinquished.value),
    confirmation: state.uiState.submission.id,
    address: state.uiState.submission.regionalAddress,
    timestamp: state.uiState.submission.timestamp
  };
}

export default connect(mapStateToProps)(SubmitPage);
export { SubmitPage };
