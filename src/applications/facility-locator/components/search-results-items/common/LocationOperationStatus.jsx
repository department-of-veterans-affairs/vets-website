/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React from 'react';
import PropTypes from 'prop-types';
import { OperatingStatusDisplay } from '../../../constants';

const LocationOperationStatus = ({ operatingStatus }) => {
  if (!operatingStatus || operatingStatus.code === 'NORMAL') {
    return <></>;
  }

  if (!OperatingStatusDisplay[operatingStatus.code]) {
    return <></>;
  }

  const { operationStatusTitle, alertClass } = OperatingStatusDisplay[
    operatingStatus.code
  ];

  return (
    <va-alert
      uswds
      background-only
      show-icon
      slim
      visible
      status={alertClass}
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
