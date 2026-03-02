import React from 'react';

import StatusDropdown from '../../components/shared/StatusDropdown';
import {
  getRxStatus,
  getStatusDefinitions,
  getPdfStatusDefinitionKey,
} from './getRxStatus';

import {
  pdfStatusDefinitions,
  pdfDefaultStatusDefinition,
  pdfDefaultPendingMedDefinition,
  pdfDefaultPendingRenewalDefinition,
  medStatusDisplayTypes,
  DISPENSE_STATUS,
  RX_SOURCE,
} from '../constants';

import { validateField } from './validateField';

/**
 * Formats status definition lines into text with proper formatting
 * @param {Array} pdfStatusDefinition - The status definition array
 * @param {Function} newLine - Function to generate newlines
 * @returns {string} Formatted status paragraph
 */
const formatStatusParagraph = (
  pdfStatusDefinition,
  newLine = (n = 1) => '\n'.repeat(n),
) => {
  const lines = pdfStatusDefinition.flatMap(item => {
    if (Array.isArray(item.value)) {
      return item.value.map(value => `- ${String(value).trim()}`);
    }
    return [String(item.value).trim()];
  });
  return lines.join(newLine()).trimEnd();
};

/**
 * Gets status text and definition for V2 status mapping or regular mode
 * @param {Object} prescription - The prescription object
 * @param {boolean} isCernerPilot - Whether Cerner pilot is enabled
 * @param {boolean} isV2StatusMapping - Whether V2 status mapping is enabled
 * @returns {Object} Object containing statusText and statusDefinition
 */
const getStatusTextAndDefinition = (
  prescription,
  isCernerPilot,
  isV2StatusMapping,
) => {
  if (isCernerPilot && isV2StatusMapping) {
    const statusText = getRxStatus(prescription);
    const statusDefinitions = getStatusDefinitions(
      isCernerPilot,
      isV2StatusMapping,
    );
    const definitionKey = getPdfStatusDefinitionKey(
      prescription.dispStatus,
      prescription.refillStatus,
    );
    const statusDefinition =
      statusDefinitions[definitionKey] || pdfDefaultStatusDefinition;
    return { statusText, statusDefinition };
  }

  // Regular mode
  const statusText = validateField(prescription.dispStatus);
  const statusDefinition =
    pdfStatusDefinitions[prescription.refillStatus] ||
    pdfDefaultStatusDefinition;
  return { statusText, statusDefinition };
};

const determineStatus = (
  displayType,
  pendingMed,
  pendingRenewal,
  prescription,
  isCernerPilot = false,
  isV2StatusMapping = false,
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
      if (pendingMed) return pdfDefaultPendingMedDefinition;
      if (pendingRenewal) return pdfDefaultPendingRenewalDefinition;

      const { statusText, statusDefinition } = getStatusTextAndDefinition(
        prescription,
        isCernerPilot,
        isV2StatusMapping,
      );
      return `${statusText} - ${statusDefinition?.[0]?.value}`;
    }

    case medStatusDisplayTypes.TXT: {
      if (pendingMed) return pdfDefaultPendingMedDefinition;
      if (pendingRenewal) return pdfDefaultPendingRenewalDefinition;

      if (isCernerPilot && isV2StatusMapping) {
        const { statusText, statusDefinition } = getStatusTextAndDefinition(
          prescription,
          isCernerPilot,
          isV2StatusMapping,
        );
        const statusParagraph = formatStatusParagraph(statusDefinition);
        return `${statusText} - ${statusParagraph}`;
      }

      // Regular mode - use existing logic for backward compatibility
      const newLine = (n = 1) => '\n'.repeat(n);
      const statusKey = prescription.refillStatus;
      const pdfStatusDefinition =
        pdfStatusDefinitions[statusKey] || pdfDefaultStatusDefinition;
      const statusParagraph = formatStatusParagraph(
        pdfStatusDefinition,
        newLine,
      );
      const statusPrefix = prescription.dispStatus
        ? `${prescription.dispStatus.toString()} - `
        : '';
      return `${statusPrefix}${statusParagraph}`;
    }

    default:
      return null;
  }
};

/**
 * @param {{prescriptionSource: string, dispStatus: string}} prescription The prescription object to evaluate status
 * @param {string} displayType - Flag to indicate how this status is being displayed
 * @param {boolean} isCernerPilot - Whether Cerner pilot is enabled
 * @param {boolean} isV2StatusMapping - Whether V2 status mapping is enabled
 */
export const prescriptionMedAndRenewalStatus = (
  prescription,
  displayType,
  isCernerPilot = false,
  isV2StatusMapping = false,
) => {
  if (!prescription) {
    return null;
  }
  const pendingMed =
    prescription?.prescriptionSource === RX_SOURCE.PENDING_DISPENSE &&
    prescription?.dispStatus === DISPENSE_STATUS.NEW_ORDER;
  const pendingRenewal =
    prescription?.prescriptionSource === RX_SOURCE.PENDING_DISPENSE &&
    prescription?.dispStatus === DISPENSE_STATUS.RENEW;

  return determineStatus(
    displayType,
    pendingMed,
    pendingRenewal,
    prescription,
    isCernerPilot,
    isV2StatusMapping,
  );
};
