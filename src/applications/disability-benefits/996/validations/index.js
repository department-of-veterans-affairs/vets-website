import { isValidDate } from '../helpers';
import { errorMessages } from '../constants';

export const optInCheckboxRequired = (errors, isChecked) => {
  if (!isChecked) {
    errors.addError(errorMessages.optOutCheckbox);
  }
};

// This function does _additional_ date validation; it doesn't need to
// add error messages for missing values
export const checkDateRange = (errors, { from = '', to = '' } = {}) => {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const now = Date.now();

  const isFromValid = isValidDate(fromDate);
  const isToValid = isValidDate(toDate);
  const fromTime = isFromValid && fromDate.getTime();
  const toTime = isToValid && toDate.getTime();

  // From & to may be empty initially
  if (isFromValid && fromTime < now) {
    errors.from.addError(errorMessages.startDateInPast);
  }
  if (isToValid) {
    if (toTime < now) {
      errors.to.addError(errorMessages.endDateInPast);
    }
    if (isFromValid && toTime <= fromTime) {
      errors.to.addError(errorMessages.endDateBeforeStart);
    }
  }
};

export const requireRatedDisability = (err, fieldData /* , formData */) => {
  if (!fieldData.some(entry => entry['view:selected'])) {
    // The actual validation error is displayed as an alert field, so we don't
    // need to add an error message here.
    err.addError('');
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

  if (formData?.informalConferenceChoice !== 'no' && errors) {
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
