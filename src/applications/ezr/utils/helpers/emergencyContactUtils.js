import content from '../../locales/en/content.json';

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
 * Helper to generate the cancellation text for deleting the emergency contact.
 * @returns {String} - Returns the delete cancellation text for the emergency contact.
 */
export const getDeleteNo = () => content['emergency-contact-delete-no'];

/**
 * Helper to generate the delete description text.
 * @returns {String} - Returns the delete description text.
 */
export const getDeleteDescription = () =>
  content['emergency-contact-delete-description'];

/**
 * Helper to test if the item is in a completed stated.
 * @param {Object} item - The Emergency Contact item.
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
