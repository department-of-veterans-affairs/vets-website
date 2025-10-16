import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import PropTypes from 'prop-types';
import React, { forwardRef, useMemo } from 'react';

/** @constant {RegExp} Regex pattern to normalize condition IDs by removing non-alphanumeric characters */
const CONDITION_ID_REGEX = /[^a-z0-9]/g;

/**
 * Redux selector to check if toxic exposure destruction modal feature is enabled
 * @param {Object} state - Redux state
 * @returns {boolean} True if the feature toggle is enabled
 */
export const showToxicExposureDestructionModal = state =>
  state
    ? toggleValues(state)
        ?.disabilityCompensationToxicExposureDestructionModal || false
    : false;

/**
 * Validates if a value contains meaningful data
 * @param {*} value - The value to validate
 * @returns {boolean} True if the value contains meaningful data, false otherwise
 */
export const hasValidData = value => {
  if (!value) return false;

  switch (typeof value) {
    case 'boolean':
      return value === true;
    case 'string':
      return value.trim() !== '';
    case 'object':
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return Object.values(value).some(
        v => v === true || (typeof v === 'string' && v.trim() !== ''),
      );
    default:
      return false;
  }
};

/**
 * Normalizes a condition name to a consistent ID format
 * @param {string} conditionName - The condition name to normalize
 * @returns {string} Normalized condition ID with only lowercase alphanumeric characters
 */
const normalizeConditionId = conditionName =>
  conditionName.toLowerCase().replace(CONDITION_ID_REGEX, '');

/**
 * Checks if any conditions are selected
 * @param {Object} conditions - Object containing condition selections
 * @returns {boolean} True if at least one condition is selected
 */
const hasSelectedConditions = conditions =>
  Object.values(conditions).some(v => v === true);

/**
 * Determines which conditions are being removed from toxic exposure claim
 * @param {Object} conditions - Current condition selections (key-value pairs of condition IDs and boolean values)
 * @param {Array<Object>} newDisabilities - Array of disability objects with condition names
 * @returns {Array<string>} Array of condition names being removed
 */
export const getRemovingConditions = (conditions, newDisabilities) => {
  const hasNoSelection = !hasSelectedConditions(conditions);
  const selectedNone = conditions?.none === true;
  const shouldRemoveAll = selectedNone || hasNoSelection;

  return newDisabilities
    .filter(disability => disability?.condition)
    .filter(disability => {
      if (shouldRemoveAll) return true;

      const conditionId = normalizeConditionId(disability.condition);
      return !conditions[conditionId];
    })
    .map(disability => disability.condition);
};

/**
 * Formats a list of conditions into a readable string with proper grammar
 * @param {Array<string>} conditions - Array of condition names
 * @returns {string} Formatted string listing conditions (e.g., "condition1 and condition2" or "condition1, condition2, and 3 others")
 */
const formatConditionsList = conditions => {
  if (conditions.length === 0) return '';
  if (conditions.length === 1) return conditions[0];
  if (conditions.length === 2) {
    return `${conditions[0]} and ${conditions[1]}`;
  }

  const othersCount = conditions.length - 2;
  const othersText = othersCount === 1 ? 'other' : 'others';
  return `${conditions[0]}, ${conditions[1]}, and ${othersCount} ${othersText}`;
};

/**
 * Builds the modal description text based on conditions being removed
 * @param {Array<string>} removingConditions - Array of condition names being removed
 * @returns {string} Complete modal description text
 */
const buildModalDescription = removingConditions => {
  if (removingConditions.length === 0) {
    return "If you choose to remove conditions related to toxic exposure, we'll delete information about:";
  }

  const conditionsList = formatConditionsList(removingConditions);
  const asWord =
    removingConditions.length === 1 ? 'as a condition' : 'as conditions';

  return `If you choose to remove ${conditionsList} ${asWord} related to toxic exposure, we'll delete information about:`;
};

/**
 * Modal content component that displays conditions being removed and toxic exposure data to be deleted
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.formData - Form data containing toxic exposure and disability information
 * @param {React.Ref} ref - Modal ref for focus management
 * @returns {React.ReactElement} Modal content with dynamic title, description, and static list of data to be deleted
 */
export const DeleteToxicExposureModalContent = forwardRef(
  ({ formData }, modalRef) => {
    const { toxicExposure: { conditions = {} } = {}, newDisabilities = [] } =
      formData || {};

    const removingConditions = useMemo(
      () => getRemovingConditions(conditions, newDisabilities),
      [conditions, newDisabilities],
    );

    const isMultipleConditions = removingConditions.length > 1;

    const modalTitle = isMultipleConditions
      ? 'Remove conditions related to toxic exposure?'
      : 'Remove condition related to toxic exposure?';

    const modalDescription = buildModalDescription(removingConditions);

    const toxicExposureInfo = [
      'Gulf War service locations and dates (1990 and 2001)',
      'Agent Orange exposure locations and dates',
      'Other toxic exposure details and dates',
    ];

    return (
      <>
        <h4
          ref={modalRef}
          className="vads-u-font-size--h4 vads-u-color--base vads-u-margin--0"
        >
          {modalTitle}
        </h4>
        <p>{modalDescription}</p>
        <ul>
          {toxicExposureInfo.map((info, index) => (
            <li key={`info-${index}`}>{info}</li>
          ))}
        </ul>
      </>
    );
  },
);

DeleteToxicExposureModalContent.propTypes = {
  formData: PropTypes.object,
  modalRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

DeleteToxicExposureModalContent.displayName = 'DeleteToxicExposureModalContent';

export const deletedToxicExposureAlertConfirmationContent = (
  <>
    <p className="vads-u-margin-y--0">
      You’ve removed toxic exposure conditions from your claim.
    </p>
    <p className="vads-u-margin-y--0">
      Review your conditions and supporting documents to remove any information
      you don’t want to include.
    </p>
  </>
);
