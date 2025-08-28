import React from 'react';
import { useSelector } from 'react-redux';

const SpouseSummaryCardDescription = item => {
  const { data: formData } = useSelector(state => state.form);
  const { maritalStatus } = formData['view:maritalStatus'];
  return item && <p className="vads-u-margin-bottom--0">{maritalStatus}</p>;
};

export default SpouseSummaryCardDescription;
