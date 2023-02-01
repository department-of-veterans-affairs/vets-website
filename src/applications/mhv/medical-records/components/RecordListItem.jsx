import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { dateFormat } from '../util/helpers';
import { getVaccineDetails } from '../actions/vaccine';

const VaccineListItem = props => {
  const dispatch = useDispatch();
  const { record } = props;
  const formattedDate = dateFormat(record.date, 'MMMM D, YYYY');

  const showDetailsHandler = () => {
    dispatch(getVaccineDetails(record.vaccineId));
  };

  return (
    <div
      className="record-list-item vads-u-padding-y--2 vads-u-border-bottom--1px vads-u-border-color--gray-light"
      data-testid="record-list-item"
    >
      <div>
        <strong>{record.name}</strong>
      </div>
      <div>{formattedDate}</div>
      {/* <Link className="record-details-link vads-u-margin-y--0p5" to="details">
        View details
      </Link> */}
      <div>
        <Link
          to="/vaccine"
          className="record-details-link vads-u-margin-y--0p5"
          onClick={showDetailsHandler}
        >
          View details
        </Link>
      </div>
    </div>
  );
};

export default VaccineListItem;

VaccineListItem.propTypes = {
  record: PropTypes.object,
};
