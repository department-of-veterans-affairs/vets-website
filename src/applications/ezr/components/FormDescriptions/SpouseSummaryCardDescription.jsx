import React from 'react';
import { useSelector } from 'react-redux';

export const spousedStatusesToHideDate = ['single', 'widowed', 'never married'];

const SpouseSummaryCardDescription = () => {
  const { data: formData } = useSelector(state => state.form);
  const { maritalStatus } = formData['view:maritalStatus'];
  if (spousedStatusesToHideDate.includes(maritalStatus?.toLowerCase())) {
    return null;
  }
  const { dateOfMarriage } = formData;
  const renderMarriageDate = dateOfMarriage ? (
    <>
      {' '}
      <br />
      Date of Marriage: {dateOfMarriage}
    </>
  ) : null;
  return (
    <p className="vads-u-margin-bottom--0">
      {maritalStatus}
      {renderMarriageDate}
    </p>
  );
};

export default SpouseSummaryCardDescription;
