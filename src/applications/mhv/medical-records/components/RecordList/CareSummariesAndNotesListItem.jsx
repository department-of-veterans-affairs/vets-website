import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const CareSummariesAndNotesListItem = props => {
  const { record } = props;

  const dateOrDates = () => {
    if (record.startDate && record.endDate) {
      return `${record.startDate} to ${record.endDate}`;
    }
    return record.dateSigned;
  };

  const signedByOrAdmittingPhysician = () => {
    return (
      <>
        <span className="field-label">
          {record.signedBy ? 'Signed by ' : 'Admitting physician: '}
        </span>{' '}
        {record.signedBy || record.admittingPhysician}
      </>
    );
  };

  return (
    <div
      className="record-list-item vads-u-padding-y--2 vads-u-border-color--gray-light vads-u-border--0 vads-u-background-color--gray-lightest card"
      data-testid="record-list-item"
    >
      <h4>{record.name}</h4>
      <div className="fields">
        <div>{dateOrDates()}</div>
        <div>{record.facility}</div>
        {(record.signedBy || record.admittingPhysician) && (
          <div>{signedByOrAdmittingPhysician()}</div>
        )}
      </div>
      <Link
        to={`/care-summaries-and-notes/${record.id}`}
        className="vads-u-margin-y--0p5 no-print"
      >
        <strong>Details</strong>
        <i
          className="fas fa-angle-right details-link-icon"
          aria-hidden="true"
        />
      </Link>
    </div>
  );
};

export default CareSummariesAndNotesListItem;

CareSummariesAndNotesListItem.propTypes = {
  record: PropTypes.object,
};
