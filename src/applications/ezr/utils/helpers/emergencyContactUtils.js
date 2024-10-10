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
export const getDeleteTitle = () => 'Delete this emergency contact?';

/**
 * Helper to generate the confirmation text for deleting the emergency contact.
 * @returns {String} - Returns the delete confirmation text for the emergency contact.
 */
export const getDeleteYes = () => 'Yes, delete this emergency contact';

/**
 * Helper to generate the delete description text.
 * @param {Object} item - The emergency contact item containing fullName.
 * @returns {String} - Returns the delete description, including the first and last name or a fallback if the names are missing.
 */
export const getDeleteDescription = item => {
  if (item && item.fullName && item.fullName.first && item.fullName.last) {
    return `This will delete ${item.fullName.first} ${
      item.fullName.last
    } and all the information from your list of emergency contacts.`;
  }
  return 'This will delete this contact and all the information from your list of emergency contacts.'; // Fallback if data is missing
};
