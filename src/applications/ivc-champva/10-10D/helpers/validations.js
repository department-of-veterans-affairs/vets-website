import { objDiff, onReviewPage } from './utilities';
import { makeHumanReadable, validateText } from '../../shared/utilities';

/* 
This validation checks if the `certProp` value matches the corresponding
`appProp` or `sponsorProp` entry (since the certifier may be either
an applicant or the sponsor). Helps ensure their information is entered 
consistently across the form.
*/
export const fieldsMustMatchValidation = (
  errors,
  page,
  formData,
  certProp,
  appProp,
  sponsorProp,
) => {
  let target; // will populate with form data prop we want to compare against
  if (formData.certifierRole === 'applicant') {
    target = formData?.applicants?.[0]?.[appProp];
  } else if (formData.certifierRole === 'sponsor') {
    target = formData[sponsorProp];
  } else {
    return; // This validation is not applicable here.
  }

  if (target === undefined || !onReviewPage()) return;

  // E.g.: `certifierName` => `Name`:
  const friendlyName = makeHumanReadable(certProp)
    .toLowerCase()
    .split(' ')
    .at(-1);

  // For string props like phones/emails:
  if (typeof target === 'string' && page[certProp] !== target) {
    errors[certProp].addError(
      `Must match corresponding ${formData.certifierRole} ${friendlyName}: ${target}`,
    );
  } else {
    // Identify which fields of the multi-field name object are different (e.g., address fields):
    const diff = objDiff(page[certProp], target);
    if (target && diff.length > 0) {
      diff.forEach(k =>
        errors[certProp][k].addError(
          `Must match corresponding ${formData.certifierRole} ${friendlyName}: ${target[k]}`,
        ),
      );
    }
  }
};

export const certifierNameValidation = (errors, page, formData) => {
  return fieldsMustMatchValidation(
    errors,
    page,
    formData,
    'certifierName',
    'applicantName',
    'veteransFullName',
  );
};

export const certifierAddressValidation = (errors, page, formData) => {
  return fieldsMustMatchValidation(
    errors,
    page,
    formData,
    'certifierAddress',
    'applicantAddress',
    'sponsorAddress',
  );
};

export const certifierPhoneValidation = (errors, page, formData) => {
  return fieldsMustMatchValidation(
    errors,
    page,
    formData,
    'certifierPhone',
    'applicantPhone',
    'sponsorPhone',
  );
};

export const certifierEmailValidation = (errors, page, formData) => {
  return fieldsMustMatchValidation(
    errors,
    page,
    formData,
    'certifierEmail',
    'applicantEmailAddress',
    '_undefined', // Sponsor has no email field
  );
};

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
