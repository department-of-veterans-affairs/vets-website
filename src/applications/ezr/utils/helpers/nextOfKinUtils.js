import content from '../../locales/en/content.json';
import { replaceStrValues } from './general';
/**
 * Helper to get the item name for the next of kin (NoK).
 * @param {Object} item - The NoK item containing fullName.
 * @returns {String} - Returns the full name (first and last name) or an empty string if data is missing.
 */
export const getItemName = item => {
  if (item?.fullName?.first && item?.fullName?.last) {
    return `${item.fullName.first} ${item.fullName.last}`;
  }
  return ''; // Fallback if data is missing
};

/**
 * Helper to get the card description, typically the primary phone number.
 * @param {Object} item - The NoK item containing primaryPhone.
 * @returns {String} - Returns the primary phone number or an empty string if not available.
 */
export const getCardDescription = item => `${item?.primaryPhone || ''}`;

/**
 * Helper to generate the delete title text for the modal.
 * @returns {String} - Returns the delete confirmation title for the NoK.
 */
export const getDeleteTitle = () => content['next-of-kin-delete-title'];

/**
 * Helper to generate the confirmation text for deleting the NoK.
 * @returns {String} - Returns the delete confirmation text for the NoK.
 */
export const getDeleteYes = () => content['next-of-kin-delete-yes'];

/**
 * Helper to generate the delete description text.
 * @param {Object} item - The NoK item containing fullName.
 * @returns {String} - Returns the delete description, including the first and last name or a fallback if the names are missing.
 */
export const getDeleteDescription = item => {
  const firstName = item?.itemData?.fullName?.first;
  const lastName = item?.itemData?.fullName?.last;

  if (firstName && lastName) {
    const fullName = `${firstName} ${lastName}`;
    return replaceStrValues(
      content['next-of-kin-delete-description'],
      fullName,
    );
  }

  // Fallback if data is missing
  return content['next-of-kin-delete-description-default'];
};

/**
 * Helper to get the description for canceling while adding the NoK.
 * @returns {String} - Returns the cancel description text while adding the NoK.
 */
export const getCancelAddDescription = () =>
  content['next-of-kin-cancel-add-description-text'];

/**
 * Helper to get the description for cancel button while editing the NoK.
 * @returns {String} - Returns the cancel description text while editing the NoK.
 */
export const getCancelEditDescription = () =>
  content['next-of-kin-cancel-edit-description-text'];

/**
 * Helper to get the cancel title when editing the NoK.
 * @returns {String} - Returns the cancel title text while editing the NoK.
 */
export const getCancelEditTitle = () =>
  content['next-of-kin-cancel-edit-title-text'];

/**
 * Helper to get the cancel title when adding the NoK.
 * @returns {String} - Returns the cancel title text while adding the NoK.
 */
export const getCancelAddTitle = () =>
  content['next-of-kin-cancel-add-title-text'];

/**
 * Helper to get the cancel add yes button text.
 * @returns {String} - Returns cancel add yes button text.
 */
export const getCancelAddYes = () => content['next-of-kin-cancel-add-yes'];

/**
 * Helper to get the cancel add no button text.
 * @returns {String} - Returns cancel add no button text.
 */
export const getCancelAddNo = () => content['next-of-kin-cancel-add-no'];

/**
 * Helper to get the cancel edit yes button text.
 * @returns {String} - Returns cancel edit yes button text.
 */
export const getCancelEditYes = () => content['next-of-kin-cancel-edit-yes'];

/**
 * Helper to get the cancel edit no button text.
 * @returns {String} - Returns cancel edit no button text.
 */
export const getCancelEditNo = () => content['next-of-kin-cancel-edit-no'];
