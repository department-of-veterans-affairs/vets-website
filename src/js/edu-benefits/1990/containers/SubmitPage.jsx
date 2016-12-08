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
    name: state.form1990.veteran.veteranFullName,
    chapter33: state.form1990.veteran.chapter33,
    claimedBenefits: getListOfBenefits(state.form1990.veteran),
    relinquishedBenefits: getLabel(relinquishableBenefits, state.form1990.veteran.benefitsRelinquished.value),
    confirmation: state.form1990.uiState.submission.id,
    address: state.form1990.uiState.submission.regionalAddress,
    date: state.form1990.uiState.submission.timestamp
  };
}

export default connect(mapStateToProps)(SubmitPage);
export { SubmitPage };
