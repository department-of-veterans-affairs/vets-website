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
 * Helper to generate the cancellation text for deleting the NoK.
 * @returns {String} - Returns the delete cancellation text for the NoK.
 */
export const getDeleteNo = () => content['next-of-kin-delete-no'];

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
 * Helper to test if the item is in a completed stated.
 * @param {Object} item - The NoK item.
 * @returns {String} - Returns true if the item has all required fields present.
 */
export const isItemIncomplete = item => {
  return (
    !item?.fullName?.first ||
    !item?.fullName?.last ||
    !item?.primaryPhone ||
    !item?.relationship ||
    !item?.address?.street ||
    !item?.address?.city ||
    !item?.address?.country
  );
};
