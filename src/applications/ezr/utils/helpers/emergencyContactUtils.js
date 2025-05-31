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

/**
 * Helper to get the description for canceling while adding the emergency contact.
 * @returns {String} - Returns the cancel description text while adding the emergency contact.
 */
export const getCancelAddDescription = () =>
  content['emergency-contact-cancel-add-description-text'];

/**
 * Helper to get the description for cancel button while editing the emergency contact.
 * @returns {String} - Returns the cancel description text while editing the emergency contact.
 */
export const getCancelEditDescription = () =>
  content['emergency-contact-cancel-edit-description-text'];

/**
 * Helper to get the cancel title when editing the emergency contact.
 * @returns {String} - Returns the cancel title text while editing the emergency contact.
 */
export const getCancelEditTitle = () =>
  content['emergency-contact-cancel-edit-title-text'];

/**
 * Helper to get the cancel title when adding the emergency contact.
 * @returns {String} - Returns the cancel title text while adding the emergency contact.
 */
export const getCancelAddTitle = () =>
  content['emergency-contact-cancel-add-title-text'];

/**
 * Helper to get the cancel add yes button text.
 * @returns {String} - Returns cancel add yes button text.
 */
export const getCancelAddYes = () =>
  content['emergency-contact-cancel-add-yes'];

/**
 * Helper to get the cancel add no button text.
 * @returns {String} - Returns cancel add no button text.
 */
export const getCancelAddNo = () => content['emergency-contact-cancel-add-no'];

/**
 * Helper to get the cancel edit yes button text.
 * @returns {String} - Returns cancel edit yes button text.
 */
export const getCancelEditYes = () =>
  content['emergency-contact-cancel-edit-yes'];

/**
 * Helper to get the cancel edit no button text.
 * @returns {String} - Returns cancel edit no button text.
 */
export const getCancelEditNo = () =>
  content['emergency-contact-cancel-edit-no'];
