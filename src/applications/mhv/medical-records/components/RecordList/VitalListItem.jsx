import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { EMPTY_FIELD, vitalTypeDisplayNames } from '../../util/constants';

const VitalListItem = props => {
  const { record } = props;
  const displayName = vitalTypeDisplayNames[record.type];

  return (
    <div
      className="record-list-item vads-u-padding-x--3 vads-u-padding-y--2p5 vads-u-border-color--gray-light vads-u-border--0 vads-u-background-color--gray-lightest card"
      data-testid="record-list-item"
    >
      <h2 className="vads-u-font-size--h4 vads-u-line-height--4 vads-u-margin--0">
        {displayName}
      </h2>

      <div>
        <span className="vads-u-display--inline">Result:</span>{' '}
        <span className="vads-u-display--inline" data-dd-privacy="mask">
          {record.measurement}
        </span>
      </div>
      <div className="vads-u-line-height--3" data-dd-privacy="mask">
        {record.date}
      </div>
      {record.location !== EMPTY_FIELD && (
        <div
          className="location-collapsed vads-u-line-height--3"
          data-dd-privacy="mask"
        >
          {record.location}
        </div>
      )}
      <div className="print-only">
        Provider notes: <span data-dd-privacy="mask">{record.notes}</span>
      </div>
      <Link
        to={`/vitals/${_.kebabCase(record.type)}-history`}
        className="vads-u-margin-y--0p5"
      >
        <strong>View {displayName.toLowerCase()} over time</strong>
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
