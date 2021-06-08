import moment from 'moment';

import { parseISODate } from 'platform/forms-system/src/js/helpers';
import {
  isValidYear,
  isValidPartialDate,
} from 'platform/forms-system/src/js/utilities/validations';

import { hasSomeSelected } from './utils/helpers';
import { optInErrorMessage } from './content/OptIn';
import { missingIssuesErrorMessageText } from './content/additionalIssues';
import {
  missingAreaOfDisagreementErrorMessage,
  missingAreaOfDisagreementOtherErrorMessage,
} from './content/areaOfDisagreement';
import { areaOfDisagreementWorkAround } from './utils/ui';

export const requireIssue = (
  errors,
  _fieldData,
  formData = {},
  _schema,
  _uiSchema,
  _index,
  appStateData,
) => {
  // formData === pageData on review & submit page. It should include the entire
  // formData. see https://github.com/department-of-veterans-affairs/vsp-support/issues/162
  // Fall back to formData for unit testing
  const data = Object.keys(appStateData || {}).length ? appStateData : formData;
  if (errors && errors?.additionalIssues?.addError && !hasSomeSelected(data)) {
    errors.additionalIssues.addError(missingIssuesErrorMessageText);
  }
};

const minDate = moment()
  .subtract(1, 'year')
  .startOf('day');

const maxDate = moment().endOf('day');

export const validateDate = (errors, dateString) => {
  const { day, month, year } = parseISODate(dateString);
  const date = moment(dateString);
  if (year?.length >= 4 && !isValidYear(year)) {
    errors.addError(
      `Please enter a year between ${minDate.year()} and ${maxDate.year()}`,
    );
  } else if (!isValidPartialDate(day, month, year)) {
    errors.addError('Please provide a valid date');
  } else if (date.isAfter(maxDate)) {
    errors.addError('Please add a past decision date');
  } else if (date.isBefore(minDate)) {
    errors.addError(
      'Please add an issue with a decision date less than a year old',
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

export const validAdditionalIssue = (
  errors,
  { additionalIssues = [] } = {},
) => {
  if (errors.addError) {
    additionalIssues.forEach(entry => {
      if (
        !entry.issue ||
        !entry.decisionDate ||
        !isValidDate(entry.decisionDate)
      ) {
        errors.addError(missingIssuesErrorMessageText);
      }
    });
  }
};

export const areaOfDisagreementRequired = (
  errors,
  // added index to get around arrayIndex being null
  { disagreementOptions, otherEntry, index } = {},
  formData,
  _schema,
  _uiSchema,
  arrayIndex, // always null?!
) => {
  const keys = Object.keys(disagreementOptions || {});
  const hasSelection = keys.some(key => disagreementOptions[key]);

  if (!hasSelection) {
    errors.addError(missingAreaOfDisagreementErrorMessage);
  } else if (disagreementOptions.other && !otherEntry) {
    errors.addError(missingAreaOfDisagreementOtherErrorMessage);
  }

  // work-around for error message not showing :(
  areaOfDisagreementWorkAround(hasSelection, arrayIndex || index);
};

export const optInValidation = (errors, value) => {
  if (!value) {
    errors.addError(optInErrorMessage);
  }
};
