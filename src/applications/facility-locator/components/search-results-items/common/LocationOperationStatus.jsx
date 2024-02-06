/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React from 'react';
import PropTypes from 'prop-types';
import { OperatingStatus } from '../../../constants';

const LocationOperationStatus = ({ operatingStatus }) => {
  if (!operatingStatus || operatingStatus.code === 'NORMAL') {
    return <></>;
  }

  const display = {
    [OperatingStatus.CLOSED]: {
      operationStatusTitle: 'Facility Closed',
      alertClass: 'error',
    },
    [OperatingStatus.LIMITED]: {
      operationStatusTitle: 'Limited services and hours',
      alertClass: 'warning',
    },
    [OperatingStatus.NOTICE]: {
      operationStatusTitle: 'Facility notice',
      alertClass: 'info',
    },
  };

  if (!display[operatingStatus.code]) {
    return <></>;
  }

  const { operationStatusTitle, alertClass } = display[operatingStatus.code];

  return (
    <va-alert
      uswds="false"
      background-only
      show-icon
      status={alertClass}
      visible
      data-testid={`${operatingStatus.code.toLowerCase()}-message`}
      class="vads-u-margin-y--2"
    >
      <div>
        <span className="sr-only">Alert: </span>
        {operationStatusTitle}
      </div>
    </va-alert>
  );
};

LocationOperationStatus.propTypes = {
  operatingStatus: PropTypes.object,
};

export default LocationOperationStatus;
