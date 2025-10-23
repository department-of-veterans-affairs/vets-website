/**
 * Create a plain text string to display the correct text for a VA pharmacy phone number
 * @param {String} Phone number, as a string
 */
export const createVAPharmacyText = (phone = null) => {
  let dialFragment = '';
  if (phone) {
    dialFragment = `at ${phone}`;
  }
  return `your VA pharmacy ${dialFragment}`.trim();
};
