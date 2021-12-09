import moment from 'moment';

import { parseISODate } from 'platform/forms-system/src/js/helpers';
import {
  isValidYear,
  isValidPartialDate,
} from 'platform/forms-system/src/js/utilities/validations';

import { $, areaOfDisagreementWorkAround } from '../utils/ui';
import { getSelected, hasSomeSelected, hasDuplicates } from '../utils/helpers';
import {
  missingIssueErrorMessage,
  missingIssuesErrorMessageText,
  uniqueIssueErrorMessage,
  maxSelectedErrorMessage,
  maxLengthErrorMessage,
} from '../content/addIssues';
import {
  missingAreaOfDisagreementErrorMessage,
  missingAreaOfDisagreementOtherErrorMessage,
} from '../content/areaOfDisagreement';
import { MAX_SELECTIONS, MAX_ISSUE_NAME_LENGTH } from '../constants';

export const checkValidations = (validations, data, fullData) => {
  const errors = { errorMessages: [] };
  errors.addError = message => errors.errorMessages.push(message);
  validations.map(validation =>
    validation(errors, data, fullData, null, null, null, fullData),
  );
  return errors.errorMessages;
};

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

export const selectionRequired = (
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
  if (errors && !hasSomeSelected(data)) {
    errors.addError(missingIssuesErrorMessageText);
  }
};

const minDate = moment()
  .subtract(1, 'year')
  .startOf('day');

const maxDate = moment().endOf('day');

export const validateDate = (errors, dateString) => {
  const { day, month, year } = parseISODate(dateString);
  const date = moment(dateString);
  if (dateString === 'XXXX-XX-XX') {
    errors.addError('Please enter a decision date');
  } else if (year?.length >= 4 && !isValidYear(year)) {
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

// Alert Veteran to duplicates based on name & decision date
export const uniqueIssue = (
  errors,
  _fieldData,
  _formData,
  _schema,
  _uiSchema,
  _index,
  appStateData,
) => {
  if (errors?.addError && hasDuplicates(appStateData)) {
    errors.addError(uniqueIssueErrorMessage);
  }
};

export const maxIssues = (error, data) => {
  if (getSelected(data).length > MAX_SELECTIONS) {
    error.addError(maxSelectedErrorMessage);
  }
};

export const missingIssueName = (error, data) => {
  if (!data) {
    error.addError(missingIssueErrorMessage);
  }
};

export const maxNameLength = (error, data) => {
  if (data.length > MAX_ISSUE_NAME_LENGTH) {
    error.addError(maxLengthErrorMessage);
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
