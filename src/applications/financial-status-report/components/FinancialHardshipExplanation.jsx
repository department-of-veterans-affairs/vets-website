import React from 'react';
import { connect } from 'react-redux';

const FinancialHardshipExplanation = props => {
  const isWaiverSelected = props.formData.fsrDebts.some(
    debt => debt.resolution.resolutionType === 'Waiver',
  );
  if (isWaiverSelected) {
    return <p>Please tell us more about why you need a debt waiver.</p>;
  }
  return (
    <p>Please tell us more about why you need help with this debt payment.</p>
  );
};

const mapStateToProps = state => ({
  formData: state.form?.data,
});

export default connect(mapStateToProps)(FinancialHardshipExplanation);
