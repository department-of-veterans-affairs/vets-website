import { areaOfDisagreementWorkAround } from '../utils/ui';
import { missingAreaOfDisagreementErrorMessage } from '../content/areaOfDisagreement';

export const areaOfDisagreementRequired = (
  errors,
  // added index to get around arrayIndex being null
  { disagreementOptions, otherEntry, index } = {},
  formData,
  _schema,
  _uiSchema,
  arrayIndex, // always null?!
) => {
  const keys = Object.keys(disagreementOptions || {});
  const hasChoice = keys.some(key => disagreementOptions[key]) || otherEntry;

  if (!hasChoice) {
    errors.addError(missingAreaOfDisagreementErrorMessage);
  }

  // work-around for error message not showing :(
  areaOfDisagreementWorkAround(hasChoice, arrayIndex || index);
};
