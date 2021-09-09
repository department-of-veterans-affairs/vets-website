import moment from 'moment';

import { parseISODate } from 'platform/forms-system/src/js/helpers';
import {
  isValidYear,
  isValidPartialDate,
} from 'platform/forms-system/src/js/utilities/validations';

import { $, areaOfDisagreementWorkAround } from './utils/ui';
import {
  getSelected,
  hasSomeSelected,
  getIssueNameAndDate,
} from './utils/helpers';
import { optInErrorMessage } from './content/OptIn';
import {
  missingIssuesErrorMessageText,
  uniqueIssueErrorMessage,
  maxSelected,
} from './content/additionalIssues';
import {
  missingAreaOfDisagreementErrorMessage,
  missingAreaOfDisagreementOtherErrorMessage,
} from './content/areaOfDisagreement';
import { MAX_SELECTIONS } from './constants';

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

const processIssues = (array = []) =>
  array.filter(Boolean).map(entry => getIssueNameAndDate(entry));

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
  if (errors?.addError) {
    const contestableIssues = processIssues(appStateData?.contestableIssues);
    const additionalIssues = processIssues(appStateData?.additionalIssues);
    // ignore duplicate contestable issues (if any)
    const fullList = [...new Set(contestableIssues)].concat(additionalIssues);

    if (fullList.length !== new Set(fullList).size) {
      errors.addError(uniqueIssueErrorMessage);
    }
  }
};

export const maxIssues = (error, data) => {
  if (getSelected(data).length > MAX_SELECTIONS) {
    error.addError(maxSelected);
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
