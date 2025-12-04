import React from 'react';
import { useSelector } from 'react-redux';

const SpouseSummaryCardDescription = item => {
  const { data: formData } = useSelector(state => state.form);
  const { maritalStatus } = formData['view:maritalStatus'];
  const { dateOfMarriage } = formData;
  return (
    item && (
      <p className="vads-u-margin-bottom--0">
        {maritalStatus}
        <br />
        Date of Marriage: {dateOfMarriage}
      </p>
    )
  );
};

export default SpouseSummaryCardDescription;
