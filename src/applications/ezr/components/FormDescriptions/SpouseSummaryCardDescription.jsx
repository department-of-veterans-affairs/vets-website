import React from 'react';
import { useSelector } from 'react-redux';

export const maritalStatusesWithDateOfMarriage = ['married', 'separated'];

const SpouseSummaryCardDescription = () => {
  const { maritalStatus, dateOfMarriage } = useSelector(state => ({
    maritalStatus: state.form.data['view:maritalStatus'].maritalStatus,
    dateOfMarriage: state.form.data.spouseInformation[0].dateOfMarriage,
  }));
  const allDetails = [maritalStatus];
  if (
    maritalStatusesWithDateOfMarriage.includes(maritalStatus?.toLowerCase())
  ) {
    allDetails.push(`Date of Marriage: ${dateOfMarriage || ''}`);
  }
  return (
    <ul className="no-bullets">
      {allDetails.map(detail => (
        <li key={detail}>{detail}</li>
      ))}
    </ul>
  );
};

export default SpouseSummaryCardDescription;
