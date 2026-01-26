/**
 * Prescription Mapper - Data-driven field extraction
 *
 * Extracts prescription data into a normalized, format-agnostic structure.
 * This separates the "what fields to show" logic from the "how to render" logic.
 */
import {
  formatDate,
  formatProviderName,
  validateField,
  validateFieldWithName,
  DATETIME_FORMATS,
} from './formatters';
import { ACTIVE_NON_VA, NON_VA_MEDICATION_DESCRIPTION } from './staticContent';
import {
  createNoDescriptionText,
  createVAPharmacyText,
  determineRefillLabel,
  getMostRecentRxRefill,
  getRefillHistory,
  getShowRefillHistory,
  prescriptionMedAndRenewalStatus,
} from '../helpers';
import {
  getPdfStatusDefinitionKey,
  getStatusDefinitions,
} from '../helpers/getRxStatus';
import {
  medStatusDisplayTypes,
  RX_SOURCE,
  DISPENSE_STATUS,
} from '../constants';

// ============================================================================
// Field Types
// ============================================================================

/**
 * @typedef {Object} Field
 * @property {string} key - Field identifier
 * @property {string} label - Display label
 * @property {*} value - Field value (already formatted)
 * @property {string} [type] - Field type: 'text', 'date', 'rich', 'description'
 * @property {boolean} [inline] - Whether to display inline (PDF only)
 * @property {number} [indent] - Indentation level (PDF only)
 */

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if prescription is pending
 */
const isPendingPrescription = rx => {
  const pendingMed =
    rx?.prescriptionSource === RX_SOURCE.PENDING_DISPENSE &&
    rx?.dispStatus === DISPENSE_STATUS.NEW_ORDER;
  const pendingRenewal =
    rx?.prescriptionSource === RX_SOURCE.PENDING_DISPENSE &&
    rx?.dispStatus === DISPENSE_STATUS.RENEW;
  return { isPending: pendingMed || pendingRenewal, pendingMed, pendingRenewal };
};

/**
 * Format date field with standard options
 */
const dateField = (label, value, noDateMsg = 'Date not available') => ({
  label,
  value: formatDate(value, DATETIME_FORMATS.longMonthDate, noDateMsg),
  type: 'date',
});

/**
 * Create text field with validation
 */
const textField = (label, value) => ({
  label,
  value: validateFieldWithName(label, value),
  type: 'text',
});

/**
 * Create provider field
 */
const providerField = (label, firstName, lastName) => ({
  label,
  value: formatProviderName(firstName, lastName),
  type: 'text',
});

// ============================================================================
// Non-VA Prescription Mapper
// ============================================================================

/**
 * Extract fields for a Non-VA prescription
 * @param {Object} rx - Prescription object
 * @param {Object} options - Options (isCernerPilot)
 * @returns {Object} Normalized prescription data
 */
export const mapNonVAPrescription = (rx, options = {}) => {
  const { isCernerPilot = false } = options;

  const fields = [
    textField('Instructions', rx.sig),
    !isCernerPilot && textField('Reason for use', rx.indicationForUse),
    { label: 'Status', value: ACTIVE_NON_VA, type: 'text' },
    { label: '', value: NON_VA_MEDICATION_DESCRIPTION, type: 'description' },
    dateField('When you started taking this medication', rx.dispensedDate),
    providerField('Documented by', rx.providerFirstName, rx.providerLastName),
    {
      label: 'Documented at this facility',
      value: rx.facilityName || 'VA facility name not available',
      type: 'text',
    },
  ].filter(Boolean);

  return {
    name: rx?.prescriptionName || rx?.orderableItem,
    type: 'non-va',
    fields,
  };
};

// ============================================================================
// VA Prescription Mapper (List View)
// ============================================================================

/**
 * Extract fields for a VA prescription in list view
 * @param {Object} rx - Prescription object
 * @param {Object} options - Options (isCernerPilot, isV2StatusMapping)
 * @returns {Object} Normalized prescription data
 */
export const mapVAPrescriptionForList = (rx, options = {}) => {
  const { isCernerPilot = false, isV2StatusMapping = false } = options;
  const { isPending, pendingMed, pendingRenewal } = isPendingPrescription(rx);

  const statusDefinitions = getStatusDefinitions(
    isCernerPilot,
    isV2StatusMapping,
  );
  const statusDefinitionKey = getPdfStatusDefinitionKey(
    rx.dispStatus,
    rx.refillStatus,
  );

  // Get most recent refill info for grouped medications
  const getMostRecentLine = () => {
    const newest = getMostRecentRxRefill(rx);
    if (!newest) return null;
    const filledDate = formatDate(
      newest.sortedDispensedDate,
      DATETIME_FORMATS.longMonthDate,
      'Date not available',
    );
    return `${newest.prescriptionNumber}, last filled on ${filledDate}`;
  };

  const fields = [
    // Last filled and Rx number (only for non-pending)
    !isPending && dateField('Last filled on', rx.sortedDispensedDate),
    !isPending && {
      label: 'Prescription number',
      value: rx.prescriptionNumber || 'Not available',
      type: 'text',
    },
    // Status
    {
      label: 'Status',
      value: validateField(
        prescriptionMedAndRenewalStatus(
          rx,
          medStatusDisplayTypes.PRINT,
          isCernerPilot,
          isV2StatusMapping,
        ),
      ),
      type: 'text',
      // For TXT, we use a different display type
      txtValue: prescriptionMedAndRenewalStatus(
        rx,
        medStatusDisplayTypes.TXT,
        isCernerPilot,
        isV2StatusMapping,
      ),
    },
    // Status definitions (rich content for PDF only)
    !pendingMed &&
      !pendingRenewal &&
      statusDefinitions?.[statusDefinitionKey]?.length > 1 && {
        label: '',
        value: statusDefinitions[statusDefinitionKey].slice(1),
        type: 'rich',
        pdfOnly: true,
      },
    // Standard fields
    {
      label: 'Refills left',
      value: validateFieldWithName('Number of refills left', rx.refillRemaining),
      type: 'text',
    },
    dateField(
      'Request refills by this prescription expiration date',
      rx.expirationDate,
    ),
    textField('Facility', rx.facilityName),
    // Pharmacy contact - conditional on Cerner
    isCernerPilot
      ? {
          label: 'Pharmacy contact information',
          value: 'Check your prescription label or contact your VA facility.',
          type: 'text',
        }
      : textField('Pharmacy phone number', rx.phoneNumber),
    textField('Instructions', rx.sig),
    !isCernerPilot && textField('Reason for use', rx.indicationForUse),
    dateField('Prescribed on', rx.orderedDate),
    providerField('Prescribed by', rx.providerFirstName, rx.providerLastName),
    // Most recent associated prescription
    rx.groupedMedications?.length > 0 && {
      label: 'Most recent prescription associated with this medication',
      value: getMostRecentLine(),
      type: 'text',
    },
  ].filter(Boolean);

  return {
    name: rx.prescriptionName,
    type: 'va',
    isPending,
    fields,
  };
};

// ============================================================================
// VA Prescription Mapper (Detail View)
// ============================================================================

/**
 * Extract fields for a VA prescription in detail view
 * @param {Object} rx - Prescription object
 * @param {Object} options - Options (isCernerPilot, isV2StatusMapping)
 * @returns {Object} Normalized prescription data with sections
 */
export const mapVAPrescriptionForDetail = (rx, options = {}) => {
  const { isCernerPilot = false, isV2StatusMapping = false } = options;
  const { isPending, pendingMed, pendingRenewal } = isPendingPrescription(rx);

  const statusDefinitions = getStatusDefinitions(
    isCernerPilot,
    isV2StatusMapping,
  );
  const statusDefinitionKey = getPdfStatusDefinitionKey(
    rx.dispStatus,
    rx.refillStatus,
  );

  // Main prescription fields
  const mainFields = [
    !isPending && dateField('Last filled on', rx.sortedDispensedDate),
    !isPending && {
      label: 'Prescription number',
      value: rx.prescriptionNumber || 'Not available',
      type: 'text',
    },
    {
      label: 'Status',
      value: validateField(
        prescriptionMedAndRenewalStatus(
          rx,
          medStatusDisplayTypes.PRINT,
          isCernerPilot,
          isV2StatusMapping,
        ),
      ),
      type: 'text',
      txtValue: prescriptionMedAndRenewalStatus(
        rx,
        medStatusDisplayTypes.TXT,
        isCernerPilot,
        isV2StatusMapping,
      ),
    },
    !pendingMed &&
      !pendingRenewal &&
      statusDefinitions?.[statusDefinitionKey]?.length > 1 && {
        label: '',
        value: statusDefinitions[statusDefinitionKey].slice(1),
        type: 'rich',
        pdfOnly: true,
      },
    {
      label: 'Refills left',
      value: validateFieldWithName('Number of refills left', rx.refillRemaining),
      type: 'text',
    },
    dateField(
      'Request refills by this prescription expiration date',
      rx.expirationDate,
    ),
    textField('Facility', rx.facilityName),
    isCernerPilot
      ? {
          label: 'Pharmacy contact information',
          value: 'Check your prescription label or contact your VA facility.',
          type: 'text',
        }
      : textField('Pharmacy phone number', rx.phoneNumber),
    textField('Instructions', rx.sig),
    !isCernerPilot && textField('Reason for use', rx.indicationForUse),
    textField('Quantity', rx.quantity),
    dateField('Prescribed on', rx.orderedDate),
    providerField('Prescribed by', rx.providerFirstName, rx.providerLastName),
  ].filter(Boolean);

  // Refill history
  const refillHistory = getRefillHistory(rx);
  const showRefillHistory = getShowRefillHistory(refillHistory) && !isCernerPilot;

  const refillHistoryItems = showRefillHistory
    ? refillHistory.map((entry, i) => {
        const { shape, color, backImprint, frontImprint } = entry;
        const isPartialFill =
          entry.prescriptionSource === RX_SOURCE.PARTIAL_FILL;
        const refillLabel = determineRefillLabel(isPartialFill, refillHistory, i);
        const phone = entry.cmopDivisionPhone || entry.dialCmopDivisionPhone;
        const hasValidDesc =
          shape?.trim() && color?.trim() && frontImprint?.trim();

        const description = hasValidDesc
          ? {
              shape: `${shape[0].toUpperCase()}${shape.slice(1).toLowerCase()}`,
              color: `${color[0].toUpperCase()}${color.slice(1).toLowerCase()}`,
              frontImprint,
              backImprint: backImprint || null,
              phone,
            }
          : { noDescription: true, phone };

        return {
          label: refillLabel,
          date: formatDate(
            entry.dispensedDate,
            DATETIME_FORMATS.longMonthDate,
            'Date not available',
          ),
          isPartialFill,
          quantity: isPartialFill ? entry.quantity : null,
          shippedOn:
            i === 0 && !isPartialFill
              ? formatDate(
                  rx?.trackingList?.[0]?.completeDateTime,
                  DATETIME_FORMATS.longMonthDate,
                  'Date not available',
                )
              : null,
          description: !isPartialFill ? description : null,
        };
      })
    : [];

  // Previous prescriptions (grouped medications)
  const previousPrescriptions =
    rx?.groupedMedications?.map(prevRx => ({
      prescriptionNumber: prevRx.prescriptionNumber || 'Not available',
      lastFilled: formatDate(
        prevRx.sortedDispensedDate,
        DATETIME_FORMATS.longMonthDate,
        'Date not available',
      ),
      quantity: validateFieldWithName('Quantity', prevRx.quantity),
      prescribedOn: formatDate(
        prevRx.orderedDate,
        DATETIME_FORMATS.longMonthDate,
        'Date not available',
      ),
      prescribedBy: formatProviderName(
        prevRx.providerFirstName,
        prevRx.providerLastName,
      ),
    })) || [];

  return {
    name: rx?.prescriptionName || rx?.orderableItem,
    type: 'va',
    isPending,
    sections: {
      main: {
        header: 'Most recent prescription',
        fields: mainFields,
      },
      refillHistory: showRefillHistory
        ? {
            header: 'Refill history',
            count: refillHistory.length,
            items: refillHistoryItems,
          }
        : null,
      previousPrescriptions:
        previousPrescriptions.length > 0
          ? {
              header: 'Previous prescriptions',
              count: previousPrescriptions.length,
              items: previousPrescriptions,
            }
          : null,
    },
  };
};

// ============================================================================
// Prescription List Mapper
// ============================================================================

/**
 * Map an array of prescriptions for list export
 * @param {Array} prescriptions - Array of prescription objects
 * @param {Object} options - Options (isCernerPilot, isV2StatusMapping)
 * @returns {Array} Array of normalized prescription data
 */
export const mapPrescriptionList = (prescriptions, options = {}) => {
  return (prescriptions || []).map(rx => {
    if (rx?.prescriptionSource === RX_SOURCE.NON_VA) {
      return mapNonVAPrescription(rx, options);
    }
    return mapVAPrescriptionForList(rx, options);
  });
};

// ============================================================================
// Allergy Mapper
// ============================================================================

/**
 * Map an allergy to normalized format
 * @param {Object} allergy - Allergy object
 * @returns {Object} Normalized allergy data
 */
export const mapAllergy = allergy => ({
  name: allergy.name,
  fields: [
    {
      label: 'Signs and symptoms',
      value: allergy.reaction,
      type: 'list',
    },
    {
      label: 'Type of allergy',
      value: allergy.type,
      type: 'text',
    },
    {
      label: 'Observed or historical',
      value: allergy.observedOrReported,
      type: 'text',
    },
  ],
});

/**
 * Map array of allergies
 * @param {Array|null} allergies - Array of allergies or null
 * @returns {Object} Normalized allergies data with state
 */
export const mapAllergies = allergies => {
  if (allergies === null) {
    return { state: 'error', items: [] };
  }
  if (allergies.length === 0) {
    return { state: 'empty', items: [] };
  }
  return {
    state: 'loaded',
    count: allergies.length,
    items: allergies.map(mapAllergy),
  };
};
