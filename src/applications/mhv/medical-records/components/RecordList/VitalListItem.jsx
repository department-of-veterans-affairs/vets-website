import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { dateFormat } from '../../util/helpers';
import ItemList from '../shared/ItemList';

const VitalListItem = props => {
  const { record } = props;
  const formattedDate = dateFormat(record.date, 'MMMM D, YYYY');

  return (
    <div
      className="record-list-item vads-u-padding-y--2 vads-u-border-color--gray-light vads-u-border--0 vads-u-background-color--gray-lightest card"
      data-testid="record-list-item"
    >
      <h4>{record.name}</h4>
      <div className="vads-u-line-height--3">
        Measurement: {record.measurement}
      </div>
      <div>Most recent date: {formattedDate}</div>
      <div className="location-collapsed vads-u-line-height--3">
        Location: {record.facility}
      </div>
      <div className="print-only">
        Provider comments:{' '}
        <ItemList
          list={record.comments}
          emptyMessage="No comments at this time"
        />
      </div>
      <Link
        to={`/vital-details/${record.name.replace(/\s+/g, '+')}`}
        className="vads-u-margin-y--0p5 no-print"
      >
        View {record.name} over time
        <i
          className="fas fa-angle-right details-link-icon"
          aria-hidden="true"
        />
      </Link>
    </div>
  );
};

export default VitalListItem;

VitalListItem.propTypes = {
  record: PropTypes.object,
};
