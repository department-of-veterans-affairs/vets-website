import React from 'react';
import PropTypes from 'prop-types';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { Link } from 'react-router-dom';

const LabsAndTestsListItem = props => {
  const { record } = props;
  const formattedDate = formatDateLong(record.date);

  const orderedOrRequested = () => {
    return (
      <>
        <span className="field-label">
          {record.orderedBy ? 'Ordered by ' : 'Requested by '}
        </span>{' '}
        {record.orderedBy || record.requestedBy}
      </>
    );
  };

  return (
    <div
      className="record-list-item vads-u-padding-y--2 vads-u-border-color--gray-light vads-u-border--0 vads-u-background-color--gray-lightest card"
      data-testid="record-list-item"
    >
      <h4 className="vads-u-margin-bottom--0">{record.name}</h4>
      <div className="fields">
        <div>{formattedDate}</div>
        {record.type === 'radiology' && (
          <div>Type of test: X-rays and imaging tests (Radiology)</div>
        )}
        {record.type === 'chemistry_hematology' && (
          <div>Type of test: Chemistry and hematology</div>
        )}
        {(record.orderedBy || record.requestedBy) && (
          <div>{orderedOrRequested()}</div>
        )}
      </div>
      <Link
        to={`/labs-and-tests/${record.id}`}
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

export default LabsAndTestsListItem;

LabsAndTestsListItem.propTypes = {
  record: PropTypes.object,
};
