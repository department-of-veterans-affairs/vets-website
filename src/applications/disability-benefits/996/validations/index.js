import { errorMessages, SELECTED } from '../constants';

export const requireRatedDisability = (err, fieldData /* , formData */) => {
  if (!fieldData.some(entry => entry[SELECTED])) {
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
