import { isValidPhone } from '~/platform/forms/validations';

import { errorMessages } from '../constants';

import sharedErrorMessages from '../../shared/content/errorMessages';

export const validateConferenceChoice = (errors, _value, formData) => {
  if (errors) {
    const choice = formData?.informalConferenceChoice || '';
    // "yes" option is only available in HLR update choices
    if (!['yes', 'no'].includes(choice)) {
      errors.addError?.(sharedErrorMessages.requiredYesNo);
    }
  }
};

export const validateConferenceContactChoice = (errors, values, formData) => {
  const conference = formData?.informalConference || '';
  // "yes" option is only available in HLR update choices
  if (errors && conference !== 'me' && conference !== 'rep') {
    errors.addError?.(errorMessages.informalConferenceContactChoice);
  }
};

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
  if (errors && (!phone || !isValidPhone(phone))) {
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
