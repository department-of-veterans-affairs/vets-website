import { errorMessages, SELECTED } from '../constants';

export const requireRatedDisability = (err, fieldData) => {
  if (!fieldData.some(entry => entry[SELECTED])) {
    // The actual validation error is displayed as an alert field. The message
    // here will be shown on the review page
    err.addError(errorMessages.contestedIssue);
  }
};

/* v2 validations */
export const contactInfoValidation = (errors, _fieldData, formData) => {
  const { veteran = {}, homeless } = formData;
  if (!veteran.email) {
    errors.addError('Please add an email address to your profile');
  }
  if (!(veteran.homePhone?.phoneNumber || veteran.mobilePhone?.phoneNumber)) {
    errors.addError('Please add a home or mobile phone number to your profile');
  }
  if (!homeless && !veteran.address?.addressLine1) {
    errors.addError('Please add an address to your profile');
  }
};
