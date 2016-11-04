import React from 'react';
import { connect } from 'react-redux';
import SubmitMessage from '../components/SubmitMessage';

import { getListOfBenefits, getLabel } from '../utils/helpers';
import { relinquishableBenefits } from '../utils/options-for-select';

class SubmitPage extends React.Component {
  render() {
    return (
      <SubmitMessage claimType="Education Benefits" {...this.props}/>
    );
  }
}

function mapStateToProps(state) {
  return {
    name: state.veteran.veteranFullName,
    chapter33: state.veteran.chapter33,
    claimedBenefits: getListOfBenefits(state.veteran),
    relinquishedBenefits: getLabel(relinquishableBenefits, state.veteran.benefitsRelinquished.value),
    confirmation: state.uiState.submission.id,
    address: state.uiState.submission.regionalAddress,
    date: state.uiState.submission.timestamp
  };
}

export default connect(mapStateToProps)(SubmitPage);
export { SubmitPage };
