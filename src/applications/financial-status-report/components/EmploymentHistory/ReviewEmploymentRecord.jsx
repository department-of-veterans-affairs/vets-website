import React from 'react';
import moment from 'moment';

const ReviewEmploymentRecord = ({ record, edit }) => {
  return (
    <div className="employment-record-review">
      <h3 className="review-tile">
        {record.employmentType} employment at {record.employerName}
      </h3>
      <div className="review-sub-title">
        {moment(record.employmentStart).format('MMMM D, YYYY')} to Present
      </div>
      {record.monthlyIncome && (
        <div className="review-content">
          <strong>Monthly net income:</strong> ${record.monthlyIncome}
        </div>
      )}
      <button
        className="btn-edit usa-button-secondary"
        onClick={() => edit(record)}
      >
        Edit
      </button>
    </div>
  );
};

export default ReviewEmploymentRecord;
