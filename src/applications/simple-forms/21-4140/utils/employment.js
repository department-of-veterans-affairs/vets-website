// employment.js for simple-forms 21-4140
// Adapted from benefits-optimization-pingwind version

import {
  employedByVAFields,
  employmentCheckFields,
} from '../definitions/constants';

export const hasEmploymentInLast12Months = formData => {
  const employmentCheckData =
    formData?.[employmentCheckFields.parentObject] || {};
  const currentSelection =
    employmentCheckData?.[employmentCheckFields.hasEmploymentInLast12Months];

  if (currentSelection === 'yes') {
    return true;
  }

  if (currentSelection === 'no') {
    return false;
  }

  const legacyData = formData?.[employedByVAFields.parentObject] || {};
  const legacySelection = legacyData?.[employedByVAFields.isEmployedByVA];

  if (legacySelection === 'Y') {
    return true;
  }

  if (legacySelection === 'N') {
    return false;
  }

  return undefined;
};

export const shouldShowEmploymentSection = formData =>
  hasEmploymentInLast12Months(formData) === true;

export const shouldShowUnemploymentSection = formData =>
  hasEmploymentInLast12Months(formData) === false;
