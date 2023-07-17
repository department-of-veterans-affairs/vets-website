import React from 'react';
import PropTypes from 'prop-types';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { Link } from 'react-router-dom';
import ItemList from '../shared/ItemList';

const VitalListItem = props => {
  const { record } = props;
  const formattedDate = formatDateLong(record?.date);

  const content = () => {
    if (record) {
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
            Provider comments: <ItemList list={record.comments} />
          </div>
          <Link
            to={`/health-history/vitals/${record.name
              .toLowerCase()
              .replace(/\s+/g, '')}`}
            className="vads-u-margin-y--0p5 no-print"
          >
            <strong>View {record.name} over time</strong>
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

export default VitalListItem;

VitalListItem.propTypes = {
  record: PropTypes.object,
};
