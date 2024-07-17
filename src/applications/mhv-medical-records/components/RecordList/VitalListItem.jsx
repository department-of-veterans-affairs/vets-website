import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { vitalTypeDisplayNames } from '../../util/constants';

const VitalListItem = props => {
  const { record } = props;
  const displayName = vitalTypeDisplayNames[record.type];

  const updatedRecordType = useMemo(
    () => {
      const typeMap = {
        PULSE: 'HEART-RATE',
        RESPIRATION: 'BREATHING-RATE',
        PULSE_OXIMETRY: 'BLOOD-OXYGEN-LEVEL',
      };
      return typeMap[record.type] || record.type;
    },
    [record.type],
  );

  return (
    <va-card
      class="record-list-item vads-u-border--0 vads-u-padding-left--0 vads-u-padding-top--1 small-screen:vads-u-padding-top--2"
      data-testid="record-list-item"
    >
      <h2
        className="vads-u-font-size--h3 vads-u-line-height--4 vads-u-margin-top--0 vads-u-margin-bottom--1"
        data-testid="vital-li-display-name"
      >
        {displayName}
      </h2>

      {record.noRecords && (
        <p className="vads-u-margin--0">
          {`There are no ${displayName.toLowerCase()} results in your VA medical records.`}
        </p>
      )}

      {!record.noRecords && (
        <>
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
            to={`/vitals/${_.kebabCase(updatedRecordType)}-history`}
            className="vads-u-line-height--4"
            data-testid="vital-li-review-over-time"
          >
            <strong>
              Review your{' '}
              {displayName === 'Blood oxygen level (pulse oximetry)'
                ? displayName
                    .toLowerCase()
                    .split(' ')
                    .slice(0, 3)
                    .join(' ')
                : displayName.toLowerCase()}{' '}
              over time
            </strong>
            <span aria-hidden="true">
              <va-icon icon="navigate_next" size={1} />
            </span>
          </Link>
        </>
      )}
    </va-card>
  );
};

export default VitalListItem;

VitalListItem.propTypes = {
  record: PropTypes.object,
};
