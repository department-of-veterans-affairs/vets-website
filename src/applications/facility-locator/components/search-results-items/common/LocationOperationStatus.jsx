/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React from 'react';
import PropTypes from 'prop-types';
import { OperatingStatus } from '../../../constants';

// import VaAlertExpandable from '@department-of-veterans-affairs/component-library/CollapsiblePanel';
// import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
// import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

const LocationOperationStatus = ({ operatingStatus }) => {
  if (!operatingStatus || operatingStatus.code === 'NORMAL') {
    return <></>;
  }

  // console.log(toggleValues(state)[FEATURE_FLAG_NAMES.showExpandableVamcAlert]);
  const showExpandableVamcAlert = true;

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
    <div>
      <va-alert
        background-only
        show-icon
        status={alertClass}
        visible
        data-testid={`${operatingStatus.code.toLowerCase()}-message`}
        class="vads-u-margin-y--2"
      >
        <div tabIndex={0}>
          <span className="sr-only">Alert: </span>
          {operationStatusTitle}
        </div>
      </va-alert>

      {operatingStatus.supplementalStatus.map(status => {
        if (status.id.includes('COVID') && showExpandableVamcAlert) {
          return (
            <va-alert
              background-only
              show-icon
              status={alertClass}
              visible
              data-testid={`${operatingStatus.code.toLowerCase()}-message`}
              class="vads-u-margin-y--2"
            >
              <div tabIndex={0}>{status.label}</div>
            </va-alert>
          );
        }

        return null;
      })}
    </div>
  );
};

LocationOperationStatus.propTypes = {
  operatingStatus: PropTypes.object,
};

export default LocationOperationStatus;
