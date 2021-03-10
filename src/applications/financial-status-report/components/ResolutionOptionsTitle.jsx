import React from 'react';
import { connect } from 'react-redux';
import { deductionCodes } from '../../debt-letters/const/deduction-codes';

const ResolutionOptionsTitle = ({ formData }) => {
  const index = window.location.href.slice(-1);
  const { selectedDebts } = formData;
  const debt = selectedDebts[index];
  const type = deductionCodes[debt.deductionCode] || debt.benefitType;

  return (
    <div className="no-wrap">What type of help do you want for your {type}</div>
  );
};

const mapStateToProps = state => ({
  formData: state.form?.data,
});

export default connect(mapStateToProps)(ResolutionOptionsTitle);
