import { objDiff, onReviewPage } from './utilities';
import { makeHumanReadable } from '../../shared/utilities';

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
      `Must match corresponding ${
        formData.certifierRole
      } ${friendlyName}: ${target}`,
    );
  } else {
    // Identify which fields of the multi-field name object are different (e.g., address fields):
    const diff = objDiff(page[certProp], target);
    if (target && diff.length > 0) {
      diff.forEach(k =>
        errors[certProp][k].addError(
          `Must match corresponding ${
            formData.certifierRole
          } ${friendlyName}: ${target[k]}`,
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
 * Validates an applicant's date of marriage to sponsor is not before
 * said applicant's date of birth.
 * @param {Object} errors - The errors object for the current page
 * @param {String} page - The current page data (a date string in format YYYY-MM-DD)
 * @param {Object} formData - Full form data for this applicant
 * @param {Object} _pattern - Regex used for validation (unreferenced)
 * @param {Object} _msgText - Error message text (unreferenced)
 * @param {Number} index - Current list loop item index (only present on review-and-submit page)
 */
export const validateMarriageAfterDob = (
  errors,
  page,
  formData,
  _pattern,
  _msgText,
  index,
) => {
  // Since formData is different on the review page vs within the list loop,
  // use the presence of the index as a means to identify where we are.
  // (index is null in the list loop, populated on review page)
  const fd = formData?.applicants ? formData.applicants[index] : formData;

  const difference = Date.parse(page) - Date.parse(fd?.applicantDob);

  if (difference !== undefined && difference <= 0) {
    errors.addError("Date of marriage must be after applicant's date of birth");
  }
};

/**
 * Validates an applicant's date of marriage to sponsor is not before
 * the sponsor's date of birth.
 * @param {Object} errors - The errors object for the current page
 * @param {String} page - The current page data (a date string in format YYYY-MM-DD)
 * @param {Object} formData - Full form data for this applicant
 * @param {Object} _pattern - Regex used for validation (unreferenced)
 * @param {Object} _msgText - Error message text (unreferenced)
 * @param {Number} index - Current list loop item index (only present on review-and-submit page)
 */
export const validateMarriageAfterSponsorDob = (
  errors,
  page,
  formData,
  _pattern,
  _msgText,
  index,
) => {
  // Since formData is different on the review page vs within the list loop,
  // use the presence of the index as a means to identify where we are.
  // (index is null in the list loop, populated on review page)
  const fd = formData?.applicants ? formData.applicants[index] : formData;

  // view:sponsorDob is added to applicant form data via the custom page
  // entrypoint for this page.
  const difference = Date.parse(page) - Date.parse(fd?.['view:sponsorDob']);

  if (difference !== undefined && difference <= 0) {
    errors.addError("Date of marriage must be after sponsor's date of birth");
  }
};
