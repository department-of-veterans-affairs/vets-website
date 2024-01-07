import React from 'react';
import PropTypes from 'prop-types';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { Link } from 'react-router-dom';
import { labTypes } from '../../util/constants';

const LabsAndTestsListItem = props => {
  const { record } = props;
  const formattedDate = formatDateLong(record.date);

  return (
    <div
      className="record-list-item vads-u-padding--3 vads-u-border-color--gray-light vads-u-border--0 vads-u-background-color--gray-lightest card"
      data-testid="record-list-item"
    >
      <h3 className="vads-u-font-size--h4 vads-u-line-height--4 vads-u-margin-bottom--0p5">
        <Link
          to={`/labs-and-tests/${record.id}`}
          data-dd-privacy="mask"
          aria-label={`${record.name} ${formattedDate}`}
        >
          {record.name}
        </Link>
      </h3>

      <div>
        <div>{formattedDate}</div>
        {record.type === labTypes.RADIOLOGY && (
          <div>Type of test: X-rays and imaging tests (Radiology)</div>
        )}
        {record.type === labTypes.CHEM_HEM && (
          <div>Type of test: Chemistry and hematology</div>
        )}
        <div>Ordered by {record.orderedBy}</div>
      </div>
    </div>
  );
};

export default LabsAndTestsListItem;

LabsAndTestsListItem.propTypes = {
  record: PropTypes.object,
};
