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
          <h4>{record.name}</h4>
          <p className="vads-u-margin--0">Date entered: {formattedDate}</p>
          <Link
            to={`/health-history/health-conditions/${record.id}`}
            className="vads-u-margin--0 no-print"
          >
            <strong>Details</strong>
            <i
              className="fas fa-angle-right details-link-icon"
              aria-hidden="true"
            />
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
