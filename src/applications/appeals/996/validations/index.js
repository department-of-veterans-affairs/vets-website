import { errorMessages } from '../constants';
import { validateRequireRatedDisability } from '../../shared/validations';

export const requireRatedDisability = (err = {}, fieldData) => {
  validateRequireRatedDisability(err, fieldData, errorMessages);
};

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
