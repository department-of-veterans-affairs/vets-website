import { isValidPhone } from '~/platform/forms/validations';

import { errorMessages } from '../constants';
import { hideNewHlrContent } from '../utils/helpers';

import sharedErrorMessages from '../../shared/content/errorMessages';

export const validateConferenceChoice = (errors, values, formData) => {
  const conference = formData?.informalConference || values || '';
  if (errors) {
    // "yes" option is only available in HLR update choices
    if (
      hideNewHlrContent(formData) &&
      (conference === 'yes' || conference === '')
    ) {
      errors.addError?.(errorMessages.informalConferenceContactChoice);
    }
    if (conference === '') {
      errors.addError?.(sharedErrorMessages.requiredYesNo);
    }
  }
};

export const validateConferenceContactChoice = (errors, values, formData) => {
  const conference = formData?.informalConference || values || '';
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
