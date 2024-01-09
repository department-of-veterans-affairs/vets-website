import React from 'react';
import PropTypes from 'prop-types';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { Link } from 'react-router-dom';

const ConditionListItem = props => {
  const { record } = props;
  const formattedDate = formatDateLong(record?.date);

  return (
    <div
      className="record-list-item vads-u-padding--3 vads-u-border-color--gray-light vads-u-border--0 vads-u-background-color--gray-lightest card"
      data-testid="record-list-item"
    >
      <h3 className="vads-u-font-size--h4 vads-u-margin--0 vads-u-line-height--4 no-print">
        <Link
          to={`/conditions/${record.id}`}
          className="vads-u-margin--0"
          data-dd-privacy="mask"
          aria-label={`${record.name} on ${formattedDate}`}
        >
          {record.name}
        </Link>
      </h3>
      <h3
        className="vads-u-font-size--h4 vads-u-line-height--4 print-only"
        data-dd-privacy="mask"
      >
        {record.name}
      </h3>

      <p className="vads-u-margin--0">Date entered: {formattedDate}</p>
    </div>
  );
};

export default ConditionListItem;

ConditionListItem.propTypes = {
  record: PropTypes.object,
};
