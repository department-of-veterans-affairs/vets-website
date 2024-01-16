import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { labTypes } from '../../util/constants';

const LabsAndTestsListItem = props => {
  const { record } = props;

  return (
    <div
      className="record-list-item vads-u-padding--3 vads-u-border-color--gray-light vads-u-border--0 vads-u-background-color--gray-lightest card"
      data-testid="record-list-item"
    >
      <h3
        className="vads-u-font-size--h4 vads-u-margin--0 vads-u-line-height--4"
        aria-label={`${record.name} ${record.date}`}
      >
        {record.name}
      </h3>

      <div className="fields">
        <div>{record.date}</div>
        {record.type === labTypes.RADIOLOGY && (
          <div>Type of test: X-rays and imaging tests (Radiology)</div>
        )}
        {record.type === labTypes.CHEM_HEM && (
          <div>Type of test: Chemistry and hematology</div>
        )}
        <div>
          <span className="field-label">Ordered by:</span> {record.orderedBy}
        </div>
      </div>
      <Link
        to={`/labs-and-tests/${record.id}`}
        className="vads-u-margin-y--0p5 no-print"
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
          {record.name} {record.date}
        </span>
      </Link>
    </div>
  );
};

export default LabsAndTestsListItem;

LabsAndTestsListItem.propTypes = {
  record: PropTypes.object,
};
