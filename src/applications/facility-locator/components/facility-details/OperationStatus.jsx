import React, { useMemo } from 'react';
import propTypes from 'prop-types';
import { FacilityType, OperatingStatusDisplay } from '../../constants';

export default function OperationStatus(props) {
  const { operatingStatus, website, facilityType } = props;
  const visitText = useMemo(
    () => {
      if (facilityType === FacilityType.VA_CEMETERY) {
        return (
          <p data-testid="visit-text">
            For more information about the cemetery including interment, visit
            our <va-link href={website} text="cemetery website" />.
          </p>
        );
      }
      return (
        <p data-testid="visit-text">
          Visit the <va-link href={website} text="website" /> to learn more
          about hours and services.
        </p>
      );
    },
    [facilityType, website],
  );

  if (!operatingStatus || operatingStatus.code === 'NORMAL') {
    return <></>;
  }

  const { operationStatusTitle, alertClass } = OperatingStatusDisplay[
    operatingStatus.code
  ];

  return (
    <va-alert
      close-btn-aria-label="Close notification"
      status={alertClass}
      visible
      uswds
    >
      <h2 slot="headline">{operationStatusTitle}</h2>
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
