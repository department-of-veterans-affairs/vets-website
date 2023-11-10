import moment from 'moment';

import { SHOW_PART3 } from '../constants';
import { issueErrorMessages } from '../content/addIssue';

import { MAX_YEARS_PAST } from '../../shared/constants';
import {
  createScreenReaderErrorMsg,
  addDateErrorMessages,
  createDateObject,
} from '../../shared/validations/date';

const minDate1 = moment()
  .subtract(1, 'year')
  .startOf('day');

const minDate100 = moment()
  .subtract(MAX_YEARS_PAST, 'year')
  .startOf('day');

export const validateDate = (
  errors,
  rawDateString = '',
  formData = {},
  _schema,
  _uiSchema,
  _index,
  appStateData,
) => {
  const data = Object.keys(appStateData || {}).length ? appStateData : formData;

  const date = createDateObject(rawDateString);

  const hasMessages = addDateErrorMessages(errors, issueErrorMessages, date);
  if (!hasMessages) {
    if (!data[SHOW_PART3] && date.momentDate.isBefore(minDate1)) {
      errors.addError(issueErrorMessages.recentDate);
      date.errors.year = true;
    } else if (date.momentDate.isBefore(minDate100)) {
      // max 1 year for old form or 100 years for newer form
      errors.addError(issueErrorMessages.newerDate);
      date.errors.year = true; // only the year is invalid at this point
    }
  }

  // add second error message containing the part of the date with an error;
  // used to add `aria-invalid` to the specific input
  createScreenReaderErrorMsg(errors, date.errors);
};

/**
 * Use above validation to set initial edit state
 */
export const isValidDate = dateString => {
  let isValid = true;
  const errors = {
    addError: () => {
      isValid = false;
    },
  };
  validateDate(errors, dateString);
  return isValid;
};
