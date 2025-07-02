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

export function noDash(str) {
  return str?.replace(/-/g, '');
}

/**
 * Validates the sponsor's SSN does not match any others in the form.
 * @param {Object} errors - The errors object for the current page
 * @param {Object} page - The current page data
 */
export const validateSponsorSsnIsUnique = (errors, page) => {
  const sponsorSSN = page?.ssn;
  const match = page?.applicants?.find(
    el => noDash(el?.applicantSSN) === noDash(sponsorSSN),
  );

  if (match) {
    errors?.ssn?.addError(
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
