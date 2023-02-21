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
      className="record-list-item vads-u-padding-y--2 vads-u-border-color--gray-light vads-u-border--0 vads-u-background-color--gray-lightest card"
      data-testid="record-list-item"
    >
      <h4>{record.name}</h4>
      <div>Date received: {formattedDate}</div>
      <div className="location-collapsed vads-u-line-height--3">
        Location: {record.facility}
      </div>
      <Link
        to="/vaccine"
        className="vads-u-margin-y--0p5"
        onClick={showDetailsHandler}
      >
        Details
        <i
          className="fas fa-angle-right details-link-icon"
          aria-hidden="true"
        />
      </Link>
    </div>
  );
};

export default VaccineListItem;

VaccineListItem.propTypes = {
  record: PropTypes.object,
};
