import { errorMessages, SELECTED } from '../constants';
import { apiVersion1 } from '../utils/helpers';

export const requireRatedDisability = (err, fieldData, formData) => {
  if (apiVersion1(formData) && !fieldData.some(entry => entry[SELECTED])) {
    // The actual validation error is displayed as an alert field. The message
    // here will be shown on the review page
    err.addError(errorMessages.contestedIssue);
  }
};

export const isFirstConferenceTimeEmpty = formData =>
  (formData?.informalConferenceTimes?.time1 || '') === '';

export const checkConferenceTimes = (errors, values, formData) => {
  if (
    errors &&
    formData?.informalConference !== 'no' &&
    (values || '') === ''
  ) {
    errors.addError(errorMessages.informalConferenceTimes);
  }
};

const phoneRegexp = /[0-9]+/;

export const validatePhone = (errors, phone) => {
  if (errors && (!phone || !phoneRegexp.test(phone) || phone.length !== 10)) {
    errors.addError(errorMessages.informalConferenceContactPhonePattern);
  }
};

export const contactInfoValidation = (errors, _fieldData, formData) => {
  const { veteran = {} } = formData;
  if (!veteran.email) {
    errors.addError('Please add an email address to your profile');
  }
  if (!veteran.phone?.phoneNumber) {
    errors.addError('Please add a phone number to your profile');
  }
  if (!veteran.address?.addressLine1) {
    errors.addError('Please add an address to your profile');
  }
};
