import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { vitalTypeDisplayNames } from '../../util/constants';

const VitalListItem = props => {
  const { record } = props;

  const content = () => {
    if (record) {
      const displayName = vitalTypeDisplayNames[record.type];
      return (
        <div
          className="record-list-item vads-u-padding-y--2 vads-u-border-color--gray-light vads-u-border--0 vads-u-background-color--gray-lightest card"
          data-testid="record-list-item"
        >
          <h3 className="vads-u-font-size--h4 vads-u-margin--0 vads-u-line-height--4">
            {displayName}
          </h3>
          <div className="vads-u-line-height--3">
            Result: <span data-dd-privacy="mask">{record.measurement}</span>
          </div>
          <div className="vads-u-line-height--3" data-dd-privacy="mask">
            {record.date}
          </div>
          <div className="location-collapsed vads-u-line-height--3">
            Location: <span data-dd-privacy="mask">{record.location}</span>
          </div>
          <div className="print-only">
            Provider notes: <span data-dd-privacy="mask">{record.notes}</span>
          </div>
          <Link
            to={`/vitals/${_.kebabCase(record.type)}-history`}
            className="vads-u-margin-y--0p5 no-print"
          >
            <strong>View {displayName.toLowerCase()} over time</strong>
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
