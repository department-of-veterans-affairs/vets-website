import React from 'react';

import StatusDropdown from '../../components/shared/StatusDropdown';

import {
  pdfStatusDefinitions,
  pdfDefaultStatusDefinition,
  pdfDefaultPendingMedDefinition,
  pdfDefaultPendingRenewalDefinition,
} from '../constants';

const determineStatus = (
  switchCase,
  pendingMed,
  pendingRenewal,
  prescription,
) => {
  let statusDefinition;
  let statusText;
  switch (switchCase) {
    case 'VaPrescription':
      if (pendingRenewal) {
        statusText = pdfDefaultPendingRenewalDefinition.reduce(
          (fullStatus, item) =>
            fullStatus + item.value + (item.continued ? ' ' : '\n'),
          '',
        );
        return <p data-testid="pending-renewal-status">{statusText}</p>;
      }
      if (pendingMed) {
        statusText = pdfDefaultPendingMedDefinition.reduce(
          (fullStatus, item) =>
            fullStatus + item.value + (item.continued ? ' ' : '\n'),
          '',
        );
        return <p>{statusText}</p>;
      }
      return <StatusDropdown status={prescription?.dispStatus} />;
    case 'print':
      if (pendingMed) {
        statusDefinition = pdfDefaultPendingMedDefinition;
      } else if (pendingRenewal) {
        statusDefinition = pdfDefaultPendingRenewalDefinition;
      } else {
        statusDefinition =
          pdfStatusDefinitions[prescription.refillStatus] ||
          pdfDefaultStatusDefinition;
      }
      return statusDefinition.reduce(
        (fullStatus, item) =>
          fullStatus + item.value + (item.continued ? ' ' : '\n'),
        '',
      );
    default:
      return null;
  }
};

/**
 * @param {obj} prescription - The prescription object containing pharmacy phone details.
 * @returns {string|null} The pharmacy phone number if available, otherwise null.
 */

export const prescriptionMedAndRenewalStatus = (prescription, switchCase) => {
  if (!prescription) {
    return null;
  }
  const pendingMed =
    prescription?.prescriptionSource === 'PD' &&
    prescription?.dispStatus === 'NewOrder';
  const pendingRenewal =
    prescription?.prescriptionSource === 'PD' &&
    prescription?.dispStatus === 'Renew';

  return determineStatus(switchCase, pendingMed, pendingRenewal, prescription);
};
