import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { loincCodes, EMPTY_FIELD } from '../../util/constants';

const CareSummariesAndNotesListItem = props => {
  const { record } = props;
  const isDischargeSummary = record.type === loincCodes.DISCHARGE_SUMMARY;

  const dateOrDates = () => {
    if (isDischargeSummary) {
      return `${record.admissionDate} to ${record.dischargeDate}`;
    }
    return record.dateSigned;
  };

  return (
    <div
      className="record-list-item vads-u-padding-y--2 vads-u-border-color--gray-light vads-u-border--0 vads-u-background-color--gray-lightest card"
      data-testid="record-list-item"
    >
      <h3
        className="vads-u-font-size--h4 vads-u-margin--0 vads-u-line-height--4"
        aria-label={`${record.name}, ${dateOrDates()}`}
      >
        {record.name}
      </h3>

      <div className="fields">
        <div>{dateOrDates()}</div>
        {record.location !== EMPTY_FIELD && <div>{record.location}</div>}
        <div>
          {isDischargeSummary ? 'Admitted by ' : 'Signed by '}{' '}
          {isDischargeSummary ? record.admittedBy : record.signedBy}
        </div>
      </div>
      <Link
        to={`/summaries-and-notes/${record.id}`}
        className="vads-u-margin-y--0p5"
        aria-describedby={`details-button-description-${record.id}`}
      >
        <strong>Details</strong>
        <i
          className="fas fa-angle-right details-link-icon"
          aria-hidden="true"
        />
        <span
          id={`details-button-description-${record.id}`}
          className="sr-only"
        >
          {record.name} {dateOrDates()}
        </span>
      </Link>
    </div>
  );
};

export default CareSummariesAndNotesListItem;

CareSummariesAndNotesListItem.propTypes = {
  record: PropTypes.object,
};
