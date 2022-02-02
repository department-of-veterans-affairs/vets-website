import moment from 'moment';

import { parseISODate } from 'platform/forms-system/src/js/helpers';
import { isValidYear } from 'platform/forms-system/src/js/utilities/validations';

import { FORMAT_YMD } from '../constants';
import { $ } from '../utils/ui';

import { issueErrorMessages } from '../content/addIssue';

const minDate = moment()
  .subtract(1, 'year')
  .startOf('day');

const maxDate = moment().endOf('day');

export const validateDate = (errors, dateString) => {
  const { day, month, year } = parseISODate(dateString);
  const date = moment(dateString, FORMAT_YMD);
  if (dateString === 'XXXX-XX-XX' || dateString === '') {
    errors.addError(issueErrorMessages.missingDecisionDate);
  } else if (!day || !month) {
    errors.addError(issueErrorMessages.invalidDate);
  } else if (year?.length >= 4 && !isValidYear(year)) {
    errors.addError(
      issueErrorMessages.invalidDateRange(minDate.year(), maxDate.year()),
    );
  } else if (date.isAfter(maxDate)) {
    errors.addError(issueErrorMessages.pastDate);
  } else if (date.isBefore(minDate)) {
    errors.addError(issueErrorMessages.newerDate);
  }
  if ($('body.modal-open')) {
    // prevent contact page modal "update" button from acting like the
    // page "continue" button
    errors.addError(
      'Please finish editing your contact info before continuing',
    );
  }
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
