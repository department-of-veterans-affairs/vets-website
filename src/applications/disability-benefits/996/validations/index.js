import { errorMessages } from '../constants';

export const requireRatedDisability = (err, fieldData /* , formData */) => {
  if (!fieldData.some(entry => entry['view:selected'])) {
    // The actual validation error is displayed as an alert field. The message
    // here will be shown on the review page
    err.addError(errorMessages.contestedIssue);
  }
};

const conferenceTimes = {
  min: 1,
  max: 2,
};

export const checkConferenceTimes = (errors, values = {}, formData) => {
  let result = '';
  const times =
    Object.keys(values || {}).reduce((acc, time) => {
      if (values[time]) {
        acc.push(time);
      }
      return acc;
    }, []) || [];

  if (formData?.informalConference !== 'no' && errors) {
    // validation
    if (times.length < conferenceTimes.min) {
      errors.addError(errorMessages.informalConferenceTimesMin);
    } else if (times.length > conferenceTimes.max) {
      errors.addError(errorMessages.informalConferenceTimesMax);
    }
  } else {
    // visibility
    result =
      times.length >= conferenceTimes.min &&
      times.length <= conferenceTimes.max;
  }
  return result;
};
