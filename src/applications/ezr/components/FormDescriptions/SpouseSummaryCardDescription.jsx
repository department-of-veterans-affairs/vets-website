import React from 'react';
import { useSelector } from 'react-redux';

export const maritalStatusesWithDateOfMarriage = ['married', 'separated'];

const SpouseSummaryCardDescription = () => {
  const { data: formData } = useSelector(state => state.form);
  const { maritalStatus } = formData['view:maritalStatus'];
  const { dateOfMarriage } = formData;
  const allDetails = [maritalStatus];
  if (
    maritalStatusesWithDateOfMarriage.includes(maritalStatus?.toLowerCase())
  ) {
    allDetails.push(`Date of Marriage: ${dateOfMarriage || ''}`);
  }
  return (
    <ul className="ezr-list-reset">
      {allDetails.map(detail => (
        <li key={detail}>{detail}</li>
      ))}
    </ul>
  );
};

export default SpouseSummaryCardDescription;
