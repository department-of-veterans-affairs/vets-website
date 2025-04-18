/**
 * Tests whether a string meets regex requirements and, if not, provides
 * a clear message to be presented to users filling out text fields.
 *
 * @param {String} value The string to test against the regex
 * @returns {String | null} Error messsage explaining invalid characters or null
 * if no violations detected
 */
export function validateText(value) {
  const invalidCharsPattern = /[~!@#$%^&*+=[\]{}()<>;:"`\\/_|]/g;
  const matches = value.match(invalidCharsPattern);

  let retVal = null;
  if (matches) {
    const uniqueInvalidChars = [...new Set(matches)].join(', ');
    const staticText = 'You entered a character we can’t accept. Try removing';
    retVal = `${staticText} ${uniqueInvalidChars}`;
  }
  return retVal;
}

/**
 * Runs `validateText` against all properties in an address object
 * to make sure they don't contain illegal characters (as defined in `validateText`).
 *
 * @param {Object} errors Formlib error objects corresponding to the address fields
 * @param {Object} page Form data accessible on the current page
 * @param {Object} formData All form fields and their data, or the current list loop item data
 * @param {String} addressProp keyname for the address property in
 * `formData` we want to access - can be omitted when checking an address prop in
 * a list loop item (see /applicant-mailing-address for example)
 */
export const validAddressCharsOnly = (errors, page, formData, addressProp) => {
  // Get address fields we want to check
  const addressFields = addressProp ? formData[addressProp] : page; // if in list loop, page is just the address fields
  // Iterate over all address properties and check all string values
  // to make sure they don't violate our list of acceptable characters:
  Object.keys(addressFields || {}).forEach(key => {
    const val = addressFields[key];
    if (typeof val === 'string') {
      const res = validateText(addressFields[key]);
      if (res) {
        const targetErr = addressProp ? errors[addressProp][key] : errors[key];
        targetErr.addError(res);
      }
    }
  });
};

export const sponsorAddressCleanValidation = (errors, page, formData) => {
  return validAddressCharsOnly(errors, page, formData, 'sponsorAddress');
};

export const certifierAddressCleanValidation = (errors, page, formData) => {
  return validAddressCharsOnly(errors, page, formData, 'certifierAddress');
};

export const applicantAddressCleanValidation = (errors, page, formData) => {
  return validAddressCharsOnly(errors, page, formData);
};
