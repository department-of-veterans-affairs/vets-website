import { isValidPhone } from '~/platform/forms/validations';

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

export const validatePhone = (errors, phone) => {
  if (errors && (!phone || !isValidPhone(phone || ''))) {
    errors.addError?.(errorMessages.informalConferenceContactPhonePattern);
  }
};

/* v2 validations */
export const contactInfoValidation = (errors = {}, _fieldData, formData) => {
  const { veteran = {}, homeless } = formData || {};
  if (!veteran.email) {
    errors.addError?.('You must add an email address to your profile');
  }
  if (!veteran.phone?.phoneNumber) {
    errors.addError?.('You must add a phone number to your profile');
  }
  if (!homeless && !veteran.address?.addressLine1) {
    errors.addError?.('You must add an address to your profile');
  }
};
