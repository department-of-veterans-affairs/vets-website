import { errorMessages } from '../content/areaOfDisagreement';
import { calculateOtherMaxLength } from '../utils/areaOfDisagreement';

export const hasAreaOfDisagreementChoice = disagreements => {
  const { disagreementOptions = {}, otherEntry = '' } = disagreements || {};
  const keys = Object.keys(disagreementOptions);
  return keys.some(key => disagreementOptions[key]) || !!otherEntry;
};

export const areaOfDisagreementRequired = (errors, fieldData) => {
  if (!hasAreaOfDisagreementChoice(fieldData)) {
    errors.addError?.(errorMessages.missingDisagreement);
  }
};

export const areaOfDisagreementMaxLength = (
  errors,
  // added index to get around arrayIndex being null
  disagreement,
) => {
  const max = calculateOtherMaxLength(disagreement);
  if (disagreement.otherEntry?.length > max) {
    errors.addError?.(errorMessages.maxOtherEntry(max));
  }
};
