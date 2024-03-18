import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { vitalTypeDisplayNames } from '../../util/constants';

const VitalListItem = props => {
  const { record } = props;
  const displayName = vitalTypeDisplayNames[record.type];

  return (
    <va-card
      class="record-list-item vads-u-border--0 vads-u-padding-left--0"
      data-testid="record-list-item"
    >
      <h2
        className="vads-u-font-size--h4 vads-u-line-height--4 vads-u-margin-top--0 vads-u-margin-bottom--1"
        data-testid="vital-li-display-name"
      >
        {displayName}
      </h2>

      <div className="vads-u-line-height--4 vads-u-margin-bottom--1">
        <span className="vads-u-display--inline vads-u-font-weight--bold">
          Most recent result:
        </span>{' '}
        <span
          className="vads-u-display--inline"
          data-dd-privacy="mask"
          data-testid="vital-li-measurement"
        >
          {record.measurement}
        </span>
      </div>

      <div
        className="vads-u-line-height--4 vads-u-margin-bottom--1"
        data-dd-privacy="mask"
        data-testid="vital-li-date"
      >
        <span className="vads-u-font-weight--bold">Date: </span>
        <span>{record.date}</span>
      </div>

      <Link
        to={`/vitals/${_.kebabCase(record.type)}-history`}
        className="vads-u-line-height--4"
        data-testid="vital-li-review-over-time"
      >
        <strong>Review {displayName.toLowerCase()} over time</strong>
        <i
          className="fas fa-angle-right details-link-icon"
          aria-hidden="true"
        />
      </Link>
    </va-card>
  );
};

export default VitalListItem;

VitalListItem.propTypes = {
  record: PropTypes.object,
};
