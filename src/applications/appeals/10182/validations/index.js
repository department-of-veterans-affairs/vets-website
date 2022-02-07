import { areaOfDisagreementWorkAround } from '../utils/ui';
import { optInErrorMessage } from '../content/OptIn';
import {
  missingAreaOfDisagreementErrorMessage,
  missingAreaOfDisagreementOtherErrorMessage,
} from '../content/areaOfDisagreement';

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
  const hasSelection = keys.some(key => disagreementOptions[key]);

  if (!hasSelection) {
    errors.addError(missingAreaOfDisagreementErrorMessage);
  } else if (disagreementOptions.other && !otherEntry) {
    errors.addError(missingAreaOfDisagreementOtherErrorMessage);
  }

  // work-around for error message not showing :(
  areaOfDisagreementWorkAround(hasSelection, arrayIndex || index);
};

export const optInValidation = (errors, value) => {
  if (!value) {
    errors.addError(optInErrorMessage);
  }
};
