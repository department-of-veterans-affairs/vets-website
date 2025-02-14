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
