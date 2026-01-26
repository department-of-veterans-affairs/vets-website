// employment.js for simple-forms 21-4140
// Adapted from benefits-optimization-pingwind version

import {
  employedByVAFields,
  employmentCheckFields,
} from '../definitions/constants';

const EMPLOYERS_PATH = 'employers';

const SECTION_TWO_KEYS = [
  employedByVAFields.hasCertifiedSection2,
  employedByVAFields.hasUnderstoodSection2,
  employedByVAFields.employerName,
  employedByVAFields.employerAddress,
  employedByVAFields.typeOfWork,
  employedByVAFields.hoursPerWeek,
  employedByVAFields.datesOfEmployment,
  employedByVAFields.lostTime,
  employedByVAFields.highestIncome,
  employedByVAFields.isEmployedByVA,
];

const SECTION_THREE_KEYS = [
  employedByVAFields.hasCertifiedSection3,
  employedByVAFields.hasUnderstoodSection3,
];

const pruneNestedObject = (object, keysToRemove) => {
  if (!object) {
    return undefined;
  }

  const next = { ...object };
  let changed = false;

  keysToRemove.forEach(key => {
    if (Object.prototype.hasOwnProperty.call(next, key)) {
      delete next[key];
      changed = true;
    }
  });

  if (!changed) {
    return object;
  }

  if (Object.keys(next).length === 0) {
    return undefined;
  }

  return next;
};

export const clearEmploymentFlowData = formData => {
  if (!formData) {
    return formData;
  }

  const updated = { ...formData };

  if (Object.prototype.hasOwnProperty.call(updated, EMPLOYERS_PATH)) {
    delete updated[EMPLOYERS_PATH];
  }

  const cleanedEmployedByVA = pruneNestedObject(
    updated[employedByVAFields.parentObject],
    SECTION_TWO_KEYS,
  );

  if (cleanedEmployedByVA === undefined) {
    delete updated[employedByVAFields.parentObject];
  } else if (cleanedEmployedByVA !== updated[employedByVAFields.parentObject]) {
    updated[employedByVAFields.parentObject] = cleanedEmployedByVA;
  }

  return updated;
};

export const clearUnemploymentFlowData = formData => {
  if (!formData) {
    return formData;
  }

  const updated = { ...formData };

  const cleanedEmployedByVA = pruneNestedObject(
    updated[employedByVAFields.parentObject],
    SECTION_THREE_KEYS,
  );

  if (cleanedEmployedByVA === undefined) {
    delete updated[employedByVAFields.parentObject];
  } else if (cleanedEmployedByVA !== updated[employedByVAFields.parentObject]) {
    updated[employedByVAFields.parentObject] = cleanedEmployedByVA;
  }

  return updated;
};

export const applyEmploymentSelection = (formData, selection) => {
  if (!selection) {
    return formData;
  }

  const employmentCheckData =
    formData?.[employmentCheckFields.parentObject] || {};

  let updated = {
    ...formData,
    [employmentCheckFields.parentObject]: {
      ...employmentCheckData,
      [employmentCheckFields.hasEmploymentInLast12Months]: selection,
    },
  };

  if (selection === 'yes') {
    updated = clearUnemploymentFlowData(updated);
  } else if (selection === 'no') {
    updated = clearEmploymentFlowData(updated);
  }

  return updated;
};

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

export const normalizeLegacyEmploymentSelection = formData => {
  const employmentCheckData =
    formData?.[employmentCheckFields.parentObject] || {};
  const selection =
    employmentCheckData?.[employmentCheckFields.hasEmploymentInLast12Months];

  if (selection === 'yes' || selection === 'no') {
    return formData;
  }

  const legacyData = formData?.[employedByVAFields.parentObject] || {};

  if (legacyData?.[employedByVAFields.isEmployedByVA] === 'Y') {
    return applyEmploymentSelection(formData, 'yes');
  }

  if (legacyData?.[employedByVAFields.isEmployedByVA] === 'N') {
    return applyEmploymentSelection(formData, 'no');
  }

  return formData;
};
