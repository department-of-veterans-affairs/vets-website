import React from 'react';
import { connect } from 'react-redux';

const ResolutionComments = ({ formData }) => {
  const index = window.location.href.slice(-1);
  const debt = formData.selectedDebts[index];
  const type = debt?.resolution?.resolutionType;

  if (type === 'Waiver') {
    return <p>Please tell us more about why you need a debt waiver.</p>;
  }
  return (
    <p>Please tell us more about why you need help with this debt payment.</p>
  );
};

const mapStateToProps = state => ({
  formData: state.form?.data,
});

export default connect(mapStateToProps)(ResolutionComments);
