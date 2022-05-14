/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React from 'react';
import PropTypes from 'prop-types';
import createCommonStore from 'platform/startup/store';
import { connectFeatureToggle } from 'platform/utilities/feature-toggles';
import { FeatureToggleReducer } from 'platform/site-wide/feature-toggles/reducers';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { OperatingStatus } from '../../../constants';

const store = createCommonStore({
  FeatureToggleReducer,
});

const LocationOperationStatus = ({ operatingStatus }) => {
  connectFeatureToggle(store.dispatch);
  store.subscribe(() => {
    const flags = toggleValues(store.getState());
    if (
      flags?.showExpandableVamcAlert === 'undefined' ||
      flags?.showExpandableVamcAlert === false
    ) {
      const expandableAlerts = document.querySelectorAll(
        // whatever the class / target is named
        '.va-alert-expandable',
      );
      expandableAlerts.forEach(element => {
        element.classList.add('vads-u-display--none');
      });
    }
  });

  if (!operatingStatus || operatingStatus.code === 'NORMAL') {
    return <></>;
  }

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
