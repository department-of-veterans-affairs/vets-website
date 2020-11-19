import React from 'react';
import moment from 'moment';

const ReviewEmploymentRecord = ({ record, edit }) => {
  const startDate = moment(record.employmentStart).format('MMMM D, YYYY');
  const endDate = moment(record.employmentEnd).format('MMMM D, YYYY');

  return (
    <div className="employment-record-review">
      <h3 className="review-tile">
        {record.employmentType} employment at {record.employerName}
      </h3>
      <div className="review-sub-title">
        {record.employmentEnd
          ? `${startDate} to ${endDate}`
          : `${startDate} to present`}
      </div>
      {record.monthlyIncome && (
        <div className="review-content">
          <strong>Monthly net income:</strong> ${record.monthlyIncome}
        </div>
      )}
      <button
        className="btn-edit usa-button-secondary"
        onClick={e => edit(e, record)}
      >
        Edit
      </button>
    </div>
  );
};

export default ReviewEmploymentRecord;
