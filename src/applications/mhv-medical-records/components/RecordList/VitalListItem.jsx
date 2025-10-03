import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { kebabCase } from 'lodash';

import { vitalTypeDisplayNames } from '../../util/constants';
import {
  dateFormatWithoutTime,
  formatDate,
  sendDataDogAction,
} from '../../util/helpers';

const VitalListItem = props => {
  const { record, options = {} } = props;
  // TODO: Should this be decoupled from isCerner as well?
  const { isAccelerating, timeFrame } = options;
  const displayName = vitalTypeDisplayNames[record.type];

  const ddLabelName = useMemo(
    () => {
      return displayName.includes('Blood oxygen level')
        ? 'Blood Oxygen over time Link'
        : `${displayName} over time Link`;
    },
    [displayName],
  );

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

  const dataTestIds = useMemo(
    () => {
      if (isAccelerating) {
        return {
          displayName: `vital-${kebabCase(updatedRecordType)}-display-name`,
          noRecordMessage: `vital-${kebabCase(
            updatedRecordType,
          )}-no-record-message`,
          measurement: `vital-${kebabCase(updatedRecordType)}-measurement`,
          date: `vital-${kebabCase(updatedRecordType)}-date`,
          dateTimestamp: `vital-${kebabCase(updatedRecordType)}-date-timestamp`,
          reviewLink: `vital-${kebabCase(updatedRecordType)}-review-over-time`,
        };
      }
      return {
        displayName: 'vital-li-display-name',
        noRecordMessage: 'vital-li-no-record-message',
        measurement: 'vital-li-measurement',
        date: 'vital-li-date',
        dateTimestamp: 'vital-li-date-timestamp',
        reviewLink: 'vital-li-review-over-time',
      };
    },
    [updatedRecordType, isAccelerating],
  );

  const url = `/vitals/${kebabCase(updatedRecordType)}-history${
    isAccelerating ? `?timeFrame=${timeFrame}` : ''
  }`;

  return (
    <va-card
      class="record-list-item vads-u-border--0 vads-u-padding-left--0 vads-u-padding-top--1 mobile-lg:vads-u-padding-top--2"
      data-testid="record-list-item"
    >
      <h2
        className="vads-u-font-size--h3 vads-u-line-height--4 vads-u-margin-top--0 vads-u-margin-bottom--1"
        data-testid={dataTestIds.displayName}
      >
        {displayName}
      </h2>

      {record.noRecords && (
        <p
          className="vads-u-margin--0"
          data-testid={dataTestIds.noRecordMessage}
        >
          {`There are no ${displayName.toLowerCase()} results ${
            isAccelerating
              ? `from the current time frame.`
              : 'in your VA medical records.'
          }`}
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
              data-dd-action-name="[vitals list - measurement]"
              data-testid={dataTestIds.measurement}
            >
              {record.measurement}
            </span>
          </div>
          <div
            className="vads-u-line-height--4 vads-u-margin-bottom--1"
            data-dd-privacy="mask"
            data-dd-action-name="[vitals list - date]"
            data-testid={dataTestIds.date}
          >
            <span className="vads-u-font-weight--bold">Date: </span>
            <span data-testid={dataTestIds.dateTimestamp}>
              {isAccelerating
                ? formatDate(record.effectiveDateTime)
                : dateFormatWithoutTime(record.date)}
            </span>
          </div>

          <Link
            to={url}
            className="vads-u-line-height--4"
            data-testid={dataTestIds.reviewLink}
            onClick={() => {
              sendDataDogAction(ddLabelName);
            }}
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
  options: PropTypes.object,
  record: PropTypes.object,
};
