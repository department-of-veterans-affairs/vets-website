import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { dateFormat } from '../../util/helpers';

const AllergyListItem = props => {
  const { record } = props;
  const formattedDate = dateFormat(record?.date, 'MMMM D, YYYY');

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
            to={`/health-history/allergies/${record.id}`}
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

export default AllergyListItem;

AllergyListItem.propTypes = {
  record: PropTypes.object,
};
