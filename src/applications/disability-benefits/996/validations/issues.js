import moment from 'moment';

import { parseISODate } from 'platform/forms-system/src/js/helpers';
import { isValidYear } from 'platform/forms-system/src/js/utilities/validations';

import { $, areaOfDisagreementWorkAround } from '../utils/ui';
import { getSelected, hasSomeSelected, hasDuplicates } from '../utils/helpers';
import { issueErrorMessages } from '../content/addIssue';
import {
  noneSelected,
  maxSelectedErrorMessage,
} from '../content/contestableIssues';
import {
  missingAreaOfDisagreementErrorMessage,
  missingAreaOfDisagreementOtherErrorMessage,
} from '../content/areaOfDisagreement';
import {
  FORMAT_YMD,
  MAX_SELECTIONS,
  MAX_ISSUE_NAME_LENGTH,
} from '../constants';

/**
 *
 * @param {Function[]} validations - array of validation functions
 * @param {*} data - field data passed to the validation function
 * @param {*} fullData - full and appStateData passed to validation function
 * @returns {String[]} - error messages
 */
export const checkValidations = (validations, data, fullData) => {
  const errors = { errorMessages: [] };
  errors.addError = message => errors.errorMessages.push(message);
  validations.map(validation =>
    validation(errors, data, fullData, null, null, null, fullData),
  );
  return errors.errorMessages;
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
    errors.addError(noneSelected);
  }
};

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
    errors.addError(issueErrorMessages.uniqueIssue);
  }
};

export const maxIssues = (error, data) => {
  if (getSelected(data).length > MAX_SELECTIONS) {
    error.addError(maxSelectedErrorMessage);
  }
};

export const missingIssueName = (error, data) => {
  if (!data) {
    error.addError(issueErrorMessages.missingIssue);
  }
};

export const maxNameLength = (error, data) => {
  if (data.length > MAX_ISSUE_NAME_LENGTH) {
    error.addError(issueErrorMessages.maxLength);
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
