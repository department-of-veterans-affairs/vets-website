/**
 * Create a plain text string for when a medication description can't be provided
 * @param {String} Phone number, as a string
 * @returns {String} A string suitable for display anywhere plain text is preferable
 */
export const createNoDescriptionText = phone => {
  let dialFragment = '';
  if (phone) {
    dialFragment = ` at ${phone}`;
  }
  return `No description available. If you need help identifying this medication, call your pharmacy${dialFragment}.`;
};
