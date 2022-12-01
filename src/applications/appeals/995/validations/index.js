import { errorMessages, SELECTED, PRIMARY_PHONE } from '../constants';

export const requireRatedDisability = (err, fieldData) => {
  if (!fieldData.some(entry => entry[SELECTED])) {
    // The actual validation error is displayed as an alert field. The message
    // here will be shown on the review page
    err.addError(errorMessages.contestedIssue);
  }
};

/* Contact info */
export const contactInfoValidation = (errors, _fieldData, formData) => {
  const { veteran = {} } = formData;
  if (!veteran.email) {
    errors.addError(errorMessages.missingEmail);
  }
  if (!(veteran.homePhone?.phoneNumber || veteran.mobilePhone?.phoneNumber)) {
    errors.addError(errorMessages.missingPhone);
  }
  if (!veteran.address?.addressLine1) {
    errors.addError(errorMessages.missingAddress);
  }
};

export const missingPrimaryPhone = (error, _fieldData, formData) => {
  if (!formData?.[PRIMARY_PHONE]) {
    error.addError(errorMessages.missingPrimaryPhone);
  }
};
