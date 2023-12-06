import { errorMessages } from '../constants';

export const isFirstConferenceTimeEmpty = formData =>
  (formData?.informalConferenceTimes?.time1 || '') === '';

export const checkConferenceTimes = (errors, values, formData) => {
  if (
    errors &&
    formData?.informalConference !== 'no' &&
    (values || '') === ''
  ) {
    errors.addError?.(errorMessages.informalConferenceTimes);
  }
};

const phoneRegexp = /[0-9]+/;

export const validatePhone = (errors, phone) => {
  if (errors && (!phone || !phoneRegexp.test(phone) || phone.length !== 10)) {
    errors.addError?.(errorMessages.informalConferenceContactPhonePattern);
  }
};

/* v2 validations */
export const contactInfoValidation = (errors = {}, _fieldData, formData) => {
  const { veteran = {}, homeless } = formData || {};
  if (!veteran.email) {
    errors.addError?.('Please add an email address to your profile');
  }
  if (!veteran.phone?.phoneNumber) {
    errors.addError?.('Please add a phone number to your profile');
  }
  if (!homeless && !veteran.address?.addressLine1) {
    errors.addError?.('Please add an address to your profile');
  }
};
