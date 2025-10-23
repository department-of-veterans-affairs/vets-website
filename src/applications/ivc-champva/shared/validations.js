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
 * Wrapper around validateText that can be used on any string field.
 *
 * @param {Object} errors Formlib error objects corresponding to the address fields
 * @param {Object} _page Form data accessible on the current page (when in list loop)
 * @param {Object} formData All form fields and their data, or the current list loop item data
 * @param {String} propName Keyname of property in formData we want to validate
 */
export function validFieldCharsOnly(errors, _page, formData, propName) {
  if (typeof formData[propName] === 'string') {
    const res = validateText(formData[propName]);
    if (res) {
      errors[propName].addError(res);
    }
  }
}

/**
 * Runs `validateText` against all properties in an address object
 * to make sure they don't contain illegal characters (as defined in `validateText`).
 *
 * @param {Object} errors Formlib error objects corresponding to the address fields
 * @param {Object} page Form data accessible on the current page (when in list loop)
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

// Wrapper around the address validator function with more generic naming.
// Enables running `validateText` on all fields in a multi-field form data element,
// e.g. the full name UI or other such inputs.
export function validObjectCharsOnly(errors, page, formData, propName) {
  return validAddressCharsOnly(errors, page, formData, propName);
}

export const sponsorAddressCleanValidation = (errors, page, formData) => {
  return validAddressCharsOnly(errors, page, formData, 'sponsorAddress');
};

export const certifierAddressCleanValidation = (errors, page, formData) => {
  return validAddressCharsOnly(errors, page, formData, 'certifierAddress');
};

export const applicantAddressCleanValidation = (errors, page, formData) => {
  return validAddressCharsOnly(errors, page, formData);
};

export function noDash(str) {
  return str?.replace(/-/g, '');
}

/**
 * Validates the sponsor's SSN does not match any others in the form.
 * @param {Object} errors - The errors object for the current page
 * @param {Object} page - The current page data
 */
export const validateSponsorSsnIsUnique = (errors, page) => {
  const keyname = page.ssn ? 'ssn' : 'sponsorSsn'; // accomodate 10-10D and 10-10d-extended
  const sponsorSSN = page[keyname];
  const match = page?.applicants?.find(
    el => noDash(el?.applicantSSN) === noDash(sponsorSSN),
  );

  if (match) {
    errors?.[keyname]?.addError(
      'This Social Security number is in use elsewhere in the form. SSNs must be unique.',
    );
  }
};

/**
 * Validates that an applicant's SSN does not match any others in the form.
 * Relies on `view:` properties set from the applicant SSN page since full
 * form data isn't available to list loop v1 pages outside a custom page.
 * @param {Object} errors - The errors object for the current page
 * @param {Object} page - The current page data
 */
export const validateApplicantSsnIsUnique = (errors, page) => {
  const idx = page?.['view:pagePerItemIndex'];
  if (idx === undefined) return; // We can't process without this
  const sponsorMatch =
    noDash(page?.applicantSSN) === noDash(page?.['view:sponsorSSN']);

  let applicants = page?.['view:applicantSSNArray'];
  if (applicants === undefined) return; // We can't process without this
  applicants = [...applicants.slice(0, idx), ...applicants.slice(idx + 1)];
  const applicantMatch = applicants?.some(
    app => noDash(app) === noDash(page?.applicantSSN),
  );

  if (sponsorMatch || applicantMatch) {
    errors.applicantSSN.addError(
      'This Social Security number is in use elsewhere in the form. SSNs must be unique.',
    );
  }
};
