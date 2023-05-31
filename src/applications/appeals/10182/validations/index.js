import { areaOfDisagreementWorkAround } from '../utils/ui';
import { missingAreaOfDisagreementErrorMessage } from '../content/areaOfDisagreement';

export const contactInfoValidation = (errors, _fieldData, formData) => {
  const { veteran = {}, homeless } = formData;
  if (!veteran.email) {
    errors.addError('Please add an email address to your profile');
  }
  if (!veteran.phone?.phoneNumber) {
    errors.addError('Please add a phone number to your profile');
  }
  if (!homeless && !veteran.address?.addressLine1) {
    errors.addError('Please add an address to your profile');
  }
};

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
