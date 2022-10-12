import moment from 'moment';

import { parseISODate } from 'platform/forms-system/src/js/helpers';
import { isValidYear } from 'platform/forms-system/src/js/utilities/validations';

import { FORMAT_YMD, MAX_LENGTH } from './constants';

import { issueErrorMessages } from './addEmploymentContent';

import { areaOfDisagreementWorkAround } from './ui';
import { missingAreaOfDisagreementErrorMessage } from './areaOfDisagreement';

import { getSelected, hasSomeSelected, hasDuplicates } from './helpers';
import {
  noneSelected,
  maxSelectedErrorMessage,
} from './contestableIssueContent';

const minDate = moment()
  .subtract(1, 'year')
  .startOf('day');

const maxDate = moment().startOf('day');

export const validateDate = (errors, dateString) => {
  const { day, month, year } = parseISODate(dateString);
  const date = moment(dateString, FORMAT_YMD);
  if (
    dateString === 'XXXX-XX-XX' ||
    dateString === '' ||
    dateString?.length < FORMAT_YMD.length
  ) {
    // errors.addError(issueErrorMessages.missingDecisionDate);
    // The va-date component currently overrides the error message when the
    // value is blank
    errors.addError(issueErrorMessages.invalidDate);
  } else if (!day || day === 'XX' || !month || month === 'XX') {
    errors.addError(issueErrorMessages.invalidDate);
  } else if (year?.length >= 4 && !isValidYear(year)) {
    errors.addError(
      issueErrorMessages.invalidDateRange(minDate.year(), maxDate.year()),
    );
  } else if (date.isSameOrAfter(maxDate)) {
    // Lighthouse won't accept same day (as submission) decision date
    errors.addError(issueErrorMessages.pastDate);
  } else if (date.isBefore(minDate)) {
    errors.addError(issueErrorMessages.newerDate);
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

export const contactInfoValidation = (errors, _fieldData, formData) => {
  const { veteran = {}, homeless } = formData;
  if (!veteran.email) {
    errors.addError('Please add an email address to your profile');
  }
  if (!veteran.phone?.phoneNumber) {
    errors.addError('Please add a phone number to your profile');
  }
  if (!homeless && !veteran.address?.addressLine1) {
    errors.addError('Please add an address to your profile');
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
  const hasChoice = keys.some(key => disagreementOptions[key]) || otherEntry;

  if (!hasChoice) {
    errors.addError(missingAreaOfDisagreementErrorMessage);
  }

  // work-around for error message not showing :(
  areaOfDisagreementWorkAround(hasChoice, arrayIndex || index);
};

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

// Alert Veteran to duplicates based on name & decision date
export const uniqueIssue = (
  errors,
  _fieldData,
  formData,
  _schema,
  _uiSchema,
  _index,
  appStateData,
) => {
  if (errors?.addError && hasDuplicates(appStateData || formData)) {
    errors.addError(issueErrorMessages.uniqueIssue);
  }
};

export const maxIssues = (
  errors,
  _fieldData,
  formData,
  _schema,
  _uiSchema,
  _index,
  appStateData,
) => {
  if (getSelected(appStateData || formData).length > MAX_LENGTH.SELECTIONS) {
    errors.addError(maxSelectedErrorMessage);
  }
};

export const missingIssueName = (errors, data) => {
  if (!data) {
    errors.addError(issueErrorMessages.missingIssue);
  }
};

export const maxNameLength = (errors, data) => {
  if (data.length > MAX_LENGTH.ISSUE_NAME) {
    errors.addError(issueErrorMessages.maxLength);
  }
};
