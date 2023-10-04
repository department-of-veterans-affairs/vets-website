import React from 'react';
import PropTypes from 'prop-types';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { Link } from 'react-router-dom';

const ConditionListItem = props => {
  const { record } = props;
  const formattedDate = formatDateLong(record?.date);

  const content = () => {
    if (record) {
      return (
        <div
          className="record-list-item vads-u-padding--3 vads-u-border-color--gray-light vads-u-border--0 vads-u-background-color--gray-lightest card"
          data-testid="record-list-item"
        >
          <h3
            className="vads-u-font-size--h4 vads-u-margin--0 vads-u-line-height--4"
            aria-label={`${record.name} ${formattedDate}`}
            data-dd-privacy="mask"
          >
            {record.name}
          </h3>

          <p className="vads-u-margin--0">
            Date entered: <span data-dd-privacy="mask">{formattedDate}</span>
          </p>
          <Link
            to={`/conditions/${record.id}`}
            className="vads-u-margin--0"
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
              {record.name} {formattedDate}
            </span>
          </Link>
        </div>
      );
    }
    return <></>;
  };

  return content();
};

export default ConditionListItem;

ConditionListItem.propTypes = {
  record: PropTypes.object,
};
