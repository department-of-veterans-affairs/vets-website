import React, { useMemo } from 'react';
import propTypes from 'prop-types';
import { OperatingStatus, FacilityType } from '../../constants';

export default function OperationStatus(props) {
  const { operatingStatus, website, facilityType } = props;
  const visitText = useMemo(
    () => {
      if (facilityType === FacilityType.VA_CEMETARY) {
        return (
          <p data-testid="visit-text">
            For more information about the cemetery including interment, visit
            our <a href={website}>cemetery website</a>.
          </p>
        );
      }
      return (
        <p data-testid="visit-text">
          Visit the <a href={website}>website</a> to learn more about hours and
          services.
        </p>
      );
    },
    [facilityType, website],
  );

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

  const { operationStatusTitle, alertClass } = display[operatingStatus.code];

  return (
    <va-alert close-btn-aria-label="" status={alertClass} visible uswds="false">
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <h2 slot="headline" role="alert">
        {operationStatusTitle}
      </h2>
      <div data-testid="status-description">
        {operatingStatus.additionalInfo && (
          <p>{operatingStatus.additionalInfo} </p>
        )}
        {website && website !== 'NULL' && visitText}
      </div>
    </va-alert>
  );
}

OperationStatus.propTypes = {
  facilityType: propTypes.string,
  operatingStatus: propTypes.shape({
    code: propTypes.string,
    additionalInfo: propTypes.string,
  }),
  website: propTypes.string,
};
