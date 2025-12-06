import React from 'react';
import { useSelector } from 'react-redux';

export const spousedStatusesToHideDate = ['married', 'separated'];

const SpouseSummaryCardDescription = () => {
  const { data: formData } = useSelector(state => state.form);
  const { maritalStatus } = formData['view:maritalStatus'];
  const { dateOfMarriage } = formData;
  const renderMarriageDate = spousedStatusesToHideDate.includes(
    maritalStatus?.toLowerCase(),
  ) ? (
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
