import React from 'react';

import StatusDropdown from '../../components/shared/StatusDropdown';

import {
  pdfStatusDefinitions,
  pdfDefaultStatusDefinition,
  pdfDefaultPendingMedDefinition,
  pdfDefaultPendingRenewalDefinition,
  medStatusDisplayTypes,
} from '../constants';

const determineStatus = (
  displayType,
  pendingMed,
  pendingRenewal,
  prescription,
) => {
  switch (displayType) {
    case medStatusDisplayTypes.VA_PRESCRIPTION:
      if (pendingRenewal) {
        return (
          <p data-testid="pending-renewal-status">
            {pdfDefaultPendingRenewalDefinition}
          </p>
        );
      }
      if (pendingMed) {
        return <p>{pdfDefaultPendingMedDefinition}</p>;
      }
      return <StatusDropdown status={prescription?.dispStatus} />;
    case medStatusDisplayTypes.PRINT: {
      if (pendingMed) {
        return pdfDefaultPendingMedDefinition;
      }
      if (pendingRenewal) {
        return pdfDefaultPendingRenewalDefinition;
      }
      const statusDefinition =
        pdfStatusDefinitions[prescription.refillStatus] ||
        pdfDefaultStatusDefinition;
      return `${prescription.dispStatus?.toString()} - ${statusDefinition.reduce(
        (fullStatus, item) =>
          fullStatus + item.value + (item.continued ? ' ' : '\n'),
        '',
      )}`;
    }
    default:
      return null;
  }
};

/**
 * @param {{prescriptionSource: string, dispStatus: string}} prescription The prescription object to evaluate status
 * @param {string} displayType - Flag to indicate how this status is being displayed
 */

export const prescriptionMedAndRenewalStatus = (prescription, displayType) => {
  if (!prescription) {
    return null;
  }
  const pendingMed =
    prescription?.prescriptionSource === 'PD' &&
    prescription?.dispStatus === 'NewOrder';
  const pendingRenewal =
    prescription?.prescriptionSource === 'PD' &&
    prescription?.dispStatus === 'Renew';

  return determineStatus(displayType, pendingMed, pendingRenewal, prescription);
};
