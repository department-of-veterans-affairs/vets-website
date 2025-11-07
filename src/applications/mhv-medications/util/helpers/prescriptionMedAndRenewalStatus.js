import React from 'react';

import StatusDropdown from '../../components/shared/StatusDropdown';

import {
  pdfStatusDefinitions,
  pdfDefaultStatusDefinition,
  pdfDefaultPendingMedDefinition,
  pdfDefaultPendingRenewalDefinition,
  medStatusDisplayTypes,
  RX_SOURCE,
} from '../constants';

import { validateField } from './validateField';

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
      return `${`${validateField(prescription.dispStatus)} - `}${
        statusDefinition?.[0]?.value
      }`;
    }
    case medStatusDisplayTypes.TXT: {
      if (pendingMed) {
        return pdfDefaultPendingMedDefinition;
      }
      if (pendingRenewal) {
        return pdfDefaultPendingRenewalDefinition;
      }
      const newLine = (n = 1) => '\n'.repeat(n);
      const statusParagraph = statusKey => {
        const pdfStatusDefinition =
          pdfStatusDefinitions[statusKey] || pdfDefaultStatusDefinition;

        const lines = pdfStatusDefinition.flatMap(item => {
          if (Array.isArray(item.value)) {
            // each sub-item becomes a bullet line
            return item.value.map(value => `- ${String(value).trim()}`);
          }
          // normal single line
          return [String(item.value).trim()];
        });

        return lines.join(newLine()).trimEnd();
      };
      return `${
        prescription.dispStatus
          ? `${prescription.dispStatus.toString()} - `
          : ''
      }${statusParagraph(prescription.refillStatus)}`;
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
    prescription?.prescriptionSource === RX_SOURCE.PENDING_DISPENSE &&
    prescription?.dispStatus === 'NewOrder';
  const pendingRenewal =
    prescription?.prescriptionSource === RX_SOURCE.PENDING_DISPENSE &&
    prescription?.dispStatus === 'Renew';

  return determineStatus(displayType, pendingMed, pendingRenewal, prescription);
};
