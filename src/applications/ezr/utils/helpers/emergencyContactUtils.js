import content from '../../locales/en/content.json';
import { replaceStrValues } from './general';
/**
 * Helper to get the item name for the emergency contact.
 * @param {Object} item - The emergency contact item containing fullName.
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
 * @param {Object} item - The emergency contact item containing primaryPhone.
 * @returns {String} - Returns the primary phone number or an empty string if not available.
 */
export const getCardDescription = item => `${item?.primaryPhone || ''}`;

/**
 * Helper to generate the delete title text for the modal.
 * @returns {String} - Returns the delete confirmation title for the emergency contact.
 */
export const getDeleteTitle = () => content['emergency-contact-delete-title'];

/**
 * Helper to generate the confirmation text for deleting the emergency contact.
 * @returns {String} - Returns the delete confirmation text for the emergency contact.
 */
export const getDeleteYes = () => content['emergency-contact-delete-yes'];

/**
 * Helper to generate the delete description text.
 * @param {Object} item - The emergency contact item containing fullName.
 * @returns {String} - Returns the delete description, including the first and last name or a fallback if the names are missing.
 */
export const getDeleteDescription = item => {
  const firstName = item?.itemData?.fullName?.first;
  const lastName = item?.itemData?.fullName?.last;

  if (firstName && lastName) {
    const fullName = `${firstName} ${lastName}`;
    return replaceStrValues(
      content['emergency-contact-delete-description'],
      fullName,
    );
  }

  // Fallback if data is missing
  return content['emergency-contact-delete-description-default'];
};
