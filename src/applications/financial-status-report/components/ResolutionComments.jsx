import React from 'react';
import { connect } from 'react-redux';

const ResolutionComments = ({ selectedDebts }) => {
  const isWaiverSelected = selectedDebts.some(
    debt => debt.resolution.resolutionType === 'Waiver',
  );

  return isWaiverSelected ? (
    <span>Please tell us more about why you need a debt waiver.</span>
  ) : (
    <span>
      Please tell us more about why you need help with this debt payment.
    </span>
  );
};

const mapStateToProps = state => ({
  selectedDebts: state.form?.data?.selectedDebts,
});

export default connect(mapStateToProps)(ResolutionComments);
