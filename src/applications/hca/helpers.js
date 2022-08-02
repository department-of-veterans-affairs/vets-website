import mapValues from 'lodash/mapValues';
import * as Sentry from '@sentry/browser';
import set from 'platform/utilities/data/set';
import moment from 'moment';
import vaMedicalFacilities from 'vets-json-schema/dist/vaMedicalFacilities.json';

import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import {
  stringifyFormReplacer,
  filterViewFields,
  filterInactivePageData,
  getActivePages,
  expandArrayPages,
  createFormPageList,
} from 'platform/forms-system/src/js/helpers';
import { getInactivePages } from 'platform/forms/helpers';
import { isValidDate } from 'platform/forms/validations';
import { isInMPI } from 'platform/user/selectors';

export {
  getMedicalCenterNameByID,
  medicalCenterLabels,
} from 'platform/utilities/medical-centers/medical-centers';

export const HIGH_DISABILITY = 50;

// clean address so we only get address related properties then return the object
const cleanAddressObject = address => {
  if (!address) return null;
  // take the address data we want from profile
  const {
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    zipCode,
    stateCode,
    countryCodeIso3,
  } = address;

  /* make the address data match the schema
   fields expect undefined NOT null */
  return {
    street: addressLine1,
    street2: addressLine2 || undefined,
    street3: addressLine3 || undefined,
    city,
    postalCode: zipCode,
    country: countryCodeIso3,
    state: stateCode,
  };
};

export function prefillTransformer(pages, formData, metadata, state) {
  const {
    residentialAddress,
    mailingAddress,
  } = state.user.profile?.vapContactInfo;

  /* mailingAddress === veteranAddress 
     residentialAddress === veteranHomeAddress */
  const cleanedResidentialAddress = cleanAddressObject(residentialAddress);
  const cleanedMailingAddress = cleanAddressObject(mailingAddress);
  const doesAddressMatch =
    JSON.stringify(cleanedResidentialAddress) ===
    JSON.stringify(cleanedMailingAddress);

  let newData = formData;

  if (isInMPI(state)) {
    newData = { ...newData, 'view:isUserInMvi': true };
  }

  if (mailingAddress) {
    // spread in permanentAddress (mailingAddress) from profile if it exist
    newData = { ...newData, veteranAddress: cleanedMailingAddress };
  }

  /* auto-fill doesPermanentAddressMatchMailing yes/no field
   does not get sent to api due to being a view do not need to guard */
  newData = {
    ...newData,
    'view:doesMailingMatchHomeAddress': doesAddressMatch,
  };

  // if either of the addresses are not present we should not fill the yes/no comparison since it will always be false
  if (!cleanedMailingAddress || !cleanedResidentialAddress) {
    newData = {
      ...newData,
      'view:doesMailingMatchHomeAddress': undefined,
    };
  }

  // if residentialAddress && addresses are not the same auto fill mailing address
  if (residentialAddress && !doesAddressMatch) {
    newData = { ...newData, veteranHomeAddress: cleanedResidentialAddress };
  }

  return {
    metadata,
    formData: newData,
    pages,
  };
}

export function transformAttachments(data) {
  if (!data.attachments || !(data.attachments instanceof Array)) {
    return data;
  }
  const transformedAttachments = data.attachments.map(attachment => {
    const { name, size, confirmationCode, attachmentId } = attachment;
    return {
      name,
      size,
      confirmationCode,
      dd214: attachmentId === '1',
    };
  });
  return { ...data, attachments: transformedAttachments };
}

function LogToSentry(formData) {
  const veteranName = formData.veteranFullName;
  const veteranDOB = formData.veteranDateOfBirth;
  const veteranSSN = formData.veteranSocialSecurityNumber;
  if (!veteranName && !veteranDOB && !veteranSSN) {
    const message = `hca_1010ez_error_unauthenticated_user_with_missing_name_dob_ssn`;
    Sentry.withScope(scope => {
      scope.setContext(message, {
        veteranName,
        veteranDOB,
        veteranSSN,
      });
      Sentry.captureMessage(message);
    });
  } else if (!veteranName && !veteranSSN) {
    const message = `hca_1010ez_error_unauthenticated_user_with_missing_name_ssn`;
    Sentry.withScope(scope => {
      scope.setContext(message, {
        veteranName,
        veteranSSN,
      });
      Sentry.captureMessage(message);
    });
  } else if (!veteranName && !veteranDOB) {
    const message = `hca_1010ez_error_unauthenticated_user_with_missing_name_dob`;
    Sentry.withScope(scope => {
      scope.setContext(message, {
        veteranName,
        veteranDOB,
      });
      Sentry.captureMessage(message);
    });
  } else if (!veteranDOB && !veteranSSN) {
    const message = `hca_1010ez_error_unauthenticated_user_with_missing_dob_ssn`;
    Sentry.withScope(scope => {
      scope.setContext(message, {
        veteranDOB,
        veteranSSN,
      });
      Sentry.captureMessage(message);
    });
  } else if (!veteranName) {
    const message = `hca_1010ez_error_unauthenticated_user_with_missing_name`;
    Sentry.withScope(scope => {
      scope.setContext(message, {
        veteranName,
      });
      Sentry.captureMessage(message);
    });
  } else if (!veteranDOB) {
    const message = `hca_1010ez_error_unauthenticated_user_with_missing_dob`;
    Sentry.withScope(scope => {
      scope.setContext(message, {
        veteranDOB,
      });
      Sentry.captureMessage(message);
    });
  } else if (!veteranSSN) {
    const message = `hca_1010ez_error_unauthenticated_user_with_missing_ssn`;
    Sentry.withScope(scope => {
      scope.setContext(message, {
        veteranSSN,
      });
      Sentry.captureMessage(message);
    });
  }
}

export function transform(formConfig, form) {
  const expandedPages = expandArrayPages(
    createFormPageList(formConfig),
    form.data,
  );
  const activePages = getActivePages(expandedPages, form.data);
  const inactivePages = getInactivePages(expandedPages, form.data);
  const withoutInactivePages = filterInactivePageData(
    inactivePages,
    activePages,
    form,
  );
  let withoutViewFields = filterViewFields(withoutInactivePages);
  const addressesMatch = form.data['view:doesMailingMatchHomeAddress'];

  // add back dependents here, because it could have been removed in filterViewFields
  if (!withoutViewFields.dependents) {
    withoutViewFields = set('dependents', [], withoutViewFields);
  }

  // convert `attachmentId` values to a `dd214` boolean
  if (withoutViewFields.attachments) {
    withoutViewFields = transformAttachments(withoutViewFields);
  }

  // duplicate address before submit if they are the same
  if (addressesMatch) {
    withoutViewFields.veteranHomeAddress = withoutViewFields.veteranAddress;
  }

  const formData =
    JSON.stringify(withoutViewFields, (key, value) => {
      // Don’t let dependents be removed in the normal empty object clean up
      if (key === 'dependents') {
        return value;
      }

      return stringifyFormReplacer(key, value);
    }) || '{}';

  let gaClientId;
  try {
    // eslint-disable-next-line no-undef
    gaClientId = ga.getAll()[0].get('clientId');
  } catch (e) {
    // don't want to break submitting because of a weird GA issue
  }

  // Log, using Sentry, when user is not logged in and is missing veteran name, ssn or dob
  if (form.data['view:isLoggedIn'] === false) {
    LogToSentry(withoutViewFields);
  }

  return JSON.stringify({
    gaClientId,
    asyncCompatible: true,
    form: formData,
  });
}

// Turns the facility list for each state into an array of strings
export const medicalCentersByState = mapValues(vaMedicalFacilities, val =>
  val.map(center => center.value),
);

export const dischargeTypeLabels = {
  honorable: 'Honorable',
  general: 'General',
  other: 'Other Than Honorable',
  'bad-conduct': 'Bad Conduct',
  dishonorable: 'Dishonorable',
  undesirable: 'Undesirable',
};

export const lastServiceBranchLabels = {
  'air force': 'Air Force',
  army: 'Army',
  'coast guard': 'Coast Guard',
  'marine corps': 'Marine Corps',
  'merchant seaman': 'Merchant Seaman',
  navy: 'Navy',
  noaa: 'Noaa',
  'space force': 'Space Force',
  usphs: 'USPHS',
  'f.commonwealth': 'Filipino Commonwealth Army',
  'f.guerilla': 'Filipino Guerilla Forces',
  'f.scouts new': 'Filipino New Scout',
  'f.scouts old': 'Filipino Old Scout',
  other: 'Other',
};

export function expensesLessThanIncome(fieldShownUnder) {
  const fields = [
    'deductibleMedicalExpenses',
    'deductibleFuneralExpenses',
    'deductibleEducationExpenses',
  ];
  return formData => {
    const {
      veteranGrossIncome = 0,
      veteranNetIncome = 0,
      veteranOtherIncome = 0,
      dependents = [],
    } = formData;

    const {
      spouseGrossIncome = 0,
      spouseNetIncome = 0,
      spouseOtherIncome = 0,
    } = formData['view:spouseIncome'] || {};

    const vetSpouseIncome =
      veteranGrossIncome +
      veteranNetIncome +
      veteranOtherIncome +
      spouseGrossIncome +
      spouseNetIncome +
      spouseOtherIncome;

    const income = dependents.reduce((sum, dependent) => {
      const { grossIncome = 0, netIncome = 0, otherIncome = 0 } = dependent;

      return grossIncome + netIncome + otherIncome + sum;
    }, vetSpouseIncome);

    const {
      deductibleMedicalExpenses = 0,
      deductibleFuneralExpenses = 0,
      deductibleEducationExpenses = 0,
    } = formData;

    const expenses =
      deductibleMedicalExpenses +
      deductibleEducationExpenses +
      deductibleFuneralExpenses;

    const hideBasedOnValues = income > expenses;

    // If we're not going to hide based on values entered,
    // then we need to make sure the current field is the last non-empty field
    if (!hideBasedOnValues) {
      const nonEmptyFields = fields.filter(field => formData[field]);
      return (
        !nonEmptyFields.length ||
        nonEmptyFields[nonEmptyFields.length - 1] !== fieldShownUnder
      );
    }

    return true;
  };
}

export const emptyObjectSchema = {
  type: 'object',
  properties: {},
};

export const idFormSchema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      minLength: 1,
      maxLength: 30,
      pattern: '^.*\\S.*',
    },
    lastName: {
      type: 'string',
      minLength: 2,
      maxLength: 30,
      pattern: '^.*\\S.*',
    },
    dob: {
      type: 'string',
      format: 'date',
    },
    ssn: {
      type: 'string',
      pattern: '^[0-9]{9}$',
    },
  },
  required: ['firstName', 'lastName', 'dob', 'ssn'],
};

export const idFormUiSchema = {
  firstName: {
    'ui:title': 'First name',
    'ui:errorMessages': {
      required: 'Please enter a first name.',
    },
  },
  lastName: {
    'ui:title': 'Last name',
    'ui:errorMessages': {
      required: 'Please enter a last name.',
    },
  },
  dob: {
    ...currentOrPastDateUI('Date of birth'),
    'ui:errorMessages': {
      required:
        'Please provide your date of birth. Select the month and day, then enter your birth year.',
    },
  },
  ssn: {
    ...ssnUI,
    'ui:errorMessages': {
      required: 'Please enter a Social Security number',
      // NOTE: this `pattern` message is ignored because the pattern
      // validation error message is hard coded in the validation function:
      // https://github.com/usds/us-forms-system/blob/db029cb4f18362870d420e3eee5b71be98004e5e/src/js/validation.js#L231
      pattern:
        'Please enter a Social Security number in this format: XXX-XX-XXXX.',
    },
  },
};

/**
 *
 * Provides the current Central Time CT offset according to whether or not daylight savings is in effect
 * @export
 * @param {boolean} isDST
 * @returns {number} offset in minutes
 */
export function getCSTOffset(isDST) {
  const offsetHours = isDST ? -5 : -6;
  return offsetHours * 60;
}

/**
 *
 * Converts a timezone offset into milliseconds
 * @export
 * @param {number} offset (in minutes)
 */
export function getOffsetTime(offset) {
  return 60000 * offset;
}

/**
 *
 * Adjusts a given time using an offset
 * @export
 * @param {number} time (in milliseconds)
 * @param {number} offset (in milliseconds)
 */
export function getAdjustedTime(time, offset) {
  return time + offset;
}

/**
 * Provides a current date object in Central Time CT
 * Adapted from https://stackoverflow.com/a/46355483 and https://stackoverflow.com/a/17085556
 */
export function getCSTDate() {
  const today = new Date();
  const isDST = moment().isDST();
  const cstOffset = getCSTOffset(isDST);

  // The UTC and Central Time times are defined in milliseconds
  // UTC time is determined by adding the local offset to the local time
  const utcTime = getAdjustedTime(
    today.getTime(),
    getOffsetTime(today.getTimezoneOffset()),
  );

  // Central Time is determined by adjusting the UTC time (derived above) using the CST offset
  const centralTime = getAdjustedTime(utcTime, getOffsetTime(cstOffset));
  return new Date(centralTime);
}

export function isBeforeCentralTimeDate(date) {
  const lastDischargeDate = moment(date, 'YYYY-MM-DD');
  const centralTimeDate = moment(getCSTDate());
  return lastDischargeDate.isBefore(centralTimeDate.startOf('day'));
}

export function isAfterCentralTimeDate(date) {
  return !isBeforeCentralTimeDate(date);
}

export function validateDate(date) {
  const newDate = moment(date, 'YYYY-MM-DD');
  const day = newDate.date();
  const month = newDate.month() + 1; // Note: Months are zero indexed, so January is month 0.
  const year = newDate.year();
  return isValidDate(day, month, year);
}

/**
 * Helper that takes two sets of props and returns true if any of its relevant
 * props are different.
 * @param {Object} prevProps - first set of props to compare
 * @param {Object} props - second set of props to compare
 * @returns {boolean} - true if any relevant props differ between the two sets
 * of props; otherwise returns false
 *
 */
export function didEnrollmentStatusChange(prevProps, props) {
  const relevantProps = [
    'enrollmentStatus',
    'noESRRecordFound',
    'shouldRedirect',
  ];
  return relevantProps.some(
    propName => prevProps[propName] !== props[propName],
  );
}
