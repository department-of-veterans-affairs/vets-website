import React from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
import { dateFormat } from '../util/helpers';

const VaccineListItem = props => {
  const { name, date } = props;

  const formattedDate = dateFormat(date, 'MMMM D, YYYY');

  return (
    <div
      className="record-list-item vads-u-padding-y--2 vads-u-border-bottom--1px vads-u-border-color--gray-light"
      data-testid="record-list-item"
    >
      <div>
        <strong>{name}</strong>
      </div>
      <div>{formattedDate}</div>
      {/* <Link className="record-details-link vads-u-margin-y--0p5" to="details">
        View details
      </Link> */}
      <div>
        <a href="/record" className="record-details-link vads-u-margin-y--0p5">
          View details
        </a>
      </div>
    </div>
  );
};

export default VaccineListItem;

VaccineListItem.propTypes = {
  date: PropTypes.string,
  name: PropTypes.string,
};
