import _ from 'platform/utilities/data';
import some from 'lodash/some';
import { isValid, isBefore, isAfter, add, startOfToday } from 'date-fns';

import {
  parseDate,
  isTreatmentBeforeService,
  findEarliestServiceDate,
  isMonthOnly,
  isYearMonth,
} from './utils/dates';

import {
  isWithinRange,
  getPOWValidationMessage,
  pathWithIndex,
  hasClaimedConditions,
  isClaimingIncrease,
  claimingRated,
  showSeparationLocation,
  sippableId,
} from './utils';

import {
  MILITARY_CITIES,
  MILITARY_STATE_VALUES,
  LOWERED_DISABILITY_DESCRIPTIONS,
  NULL_CONDITION_STRING,
  RESERVE_GUARD_TYPES,
} from './constants';

/**
 * Checks if the user has received military retirement pay
 * @param {Object} data - Form data
 * @returns true if the user has received military retired pay, false otherwise
 */
export const hasMilitaryRetiredPay = data =>
  _.get('view:hasMilitaryRetiredPay', data, false);

/**
 * Checks if the user expects to receive training pay
 * @param {Object} data - Form data
 * @returns true if the user expects to receive training pay, false otherwise
 */
export const hasTrainingPay = data => _.get('view:hasTrainingPay', data, false);

/**
 * Checks if a zip code is in a valid 5 or 9 digit format
 * @param {string} value - Zip code
 * @returns true if the zip code is in a valid format, false otherwise
 */
export function isValidZIP(value) {
  if (value !== null) {
    return /^\d{5}(?:(?:[-\s])?\d{4})?$/.test(value);
  }
  return true;
}

/**
 * Validates a given zip code. Add error message if invalid.
 * @param {Object} errors - Errors object from rjsf, which includes an addError method
 * @param {string} zip - Zip code
 */
export function validateZIP(errors, zip) {
  if (zip && !isValidZIP(zip)) {
    errors.addError(
      'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
    );
  }
}

/**
 * Contact info validation. If using a military state, validates for military
 * city. Adds error message if the city is invalid.
 * @param {Object} errors - Errors object from rjsf, which includes an addError method
 * @param {string} city - City or APO/FPO/DPO
 * @param {Object} formData - Full formData for the form
 * @param {Object} schema - Schema for the form
 * @param {Object} messages - Validation error messages
 * @param {Object} options - Validation options
 * @param {number} arrayIndex - If using an array, includes the index of the page
 */
export function validateMilitaryCity(
  errors,
  city,
  formData,
  schema,
  messages,
  options,
  arrayIndex,
) {
  const isMilitaryState = MILITARY_STATE_VALUES.includes(
    _.get(
      `${pathWithIndex(options.addressPath, arrayIndex)}.state`,
      formData,
      '',
    ),
  );
  const isMilitaryCity = MILITARY_CITIES.includes(city.trim().toUpperCase());
  if (isMilitaryState && !isMilitaryCity) {
    errors.addError(
      'City must match APO, DPO, or FPO when using a military state code',
    );
  }
}

/**
 * Contact info validation. If using military city, validates for appropriate
 * military state. Adds error message if the state is invalid.
 * @param {Object} errors - Validation errors
 * @param {string} state - State code
 * @param {Object} formData - Full formData for the form
 * @param {Object} schema - Schema for the form
 * @param {Object} messages - Validation error messages
 * @param {Object} options - Validation options
 * @param {number} arrayIndex - If using an array, includes the index of the page
 */
export function validateMilitaryState(
  errors,
  state,
  formData,
  schema,
  messages,
  options,
  arrayIndex,
) {
  const isMilitaryCity = MILITARY_CITIES.includes(
    _.get(
      `${pathWithIndex(options.addressPath, arrayIndex)}.city`,
      formData,
      '',
    )
      .trim()
      .toUpperCase(),
  );
  const isMilitaryState = MILITARY_STATE_VALUES.includes(state);
  if (isMilitaryCity && !isMilitaryState) {
    errors.addError('State must be AA, AE, or AP when using a military city');
  }
}

/**
 * VA treatment facility validation. If using a military state, validates for
 * military city. Adds error message if city is invalid.
 * @param {Object} errors - Errors object from rjsf, which includes an addError method
 * @param {string} city - City or APO/FPO/DPO
 * @param {Object} formData - Full formData for the form
 * @param {Object} schema - Schema for the form
 * @param {Object} messages - Validation error messages
 * @param {number} index - If using an array, includes the index of the page
 */
export function validateMilitaryTreatmentCity(
  errors,
  city,
  formData,
  schema,
  messages,
  index,
) {
  const isMilitaryState = MILITARY_STATE_VALUES.includes(
    _.get(
      `vaTreatmentFacilities[${index}].treatmentCenterAddress.state`,
      formData,
      '',
    ),
  );
  const isMilitaryCity = MILITARY_CITIES.includes(city.trim().toUpperCase());
  if (isMilitaryState && !isMilitaryCity) {
    errors.addError(
      'City must match APO, DPO, or FPO when using a military state code',
    );
  }
}

/**
 * VA treatment facility validation. If using military city, validates for
 * appropriate military state. Adds error message if invalid state.
 * @param {Object} errors - Errors object from rjsf, which includes an addError method
 * @param {string} state - State code
 * @param {Object} formData - Full formData for the form
 * @param {Object} schema - Schema for the form
 * @param {Object} messages - Validation error messages
 * @param {Object} index - If using an array, includes the index of the page
 */
export function validateMilitaryTreatmentState(
  errors,
  state,
  formData,
  schema,
  messages,
  index,
) {
  const isMilitaryCity = MILITARY_CITIES.includes(
    _.get(
      `vaTreatmentFacilities[${index}].treatmentCenterAddress.city`,
      formData,
      '',
    )
      .trim()
      .toUpperCase(),
  );
  const isMilitaryState = MILITARY_STATE_VALUES.includes(state);
  if (isMilitaryCity && !isMilitaryState) {
    errors.addError('State must be AA, AE, or AP when using a military city');
  }
}

/**
 * Validate that at least one type of evidence is selected. Adds error message
 * if no evidence types are selected.
 *
 * @param {Object} errors - Errors object from rjsf, which includes an addError method
 * @param {Object} fieldData - The data associated with the current schema. Boolean group
 * @param {Object} formData - Full formData for the form
 * @param {Object} schema - Schema for the form
 * @param {Object} messages - Validation error messages
 * @param {Object} options - Validation options
 * @param {number} index - If using an array, includes the index of the page
 */
export const validateIfHasEvidence = (
  errors,
  fieldData,
  formData,
  schema,
  messages,
  options,
  index,
) => {
  const { wrappedValidator } = options;
  if (_.get('view:hasEvidence', formData, true)) {
    wrappedValidator(errors, fieldData, formData, schema, messages, index);
  }
};

// Need the Lambda to pass the disability list type, so only 1 disability list has the error message.
/**
 * Validates at least one disability is selected. Adds an error message if no
 * disabilities are selected.
 * @param {string} disabilityList - The type of list, 'rated' or 'new'
 */
export const oneDisabilityRequired = disabilityList => (
  errors,
  state,
  formData,
) => {
  const ratedDisabilities = _.get('ratedDisabilities', formData, []);
  const newDisabilities = _.get('newDisabilities', formData, []);

  const hasNewDisabilitiesSelected = some(
    [...newDisabilities, ...ratedDisabilities],
    disability => disability.unemployabilityDisability,
  );

  if (!hasNewDisabilitiesSelected) {
    const errMsg =
      disabilityList === 'new' && ratedDisabilities.length
        ? ''
        : 'Please select at least one disability from the lists below.';
    errors.addError(errMsg);
  }
};

export const isInFuture = (err, fieldData) => {
  const fieldDate = new Date(fieldData);
  if (fieldDate.getTime() < Date.now()) {
    err.addError('Start date must be in the future');
  }
};

/**
 * Validates anticipated separation date. Adds error if date is not in the
 * future or if date is more than 180 days in the future.
 * @param {Object} errors - Errors object from rjsf, which includes an addError method
 * @param {string} fieldData - The data associated with the current schema. Expected separation date
 */
export const isLessThan180DaysInFuture = (errors, fieldData) => {
  const enteredDate = parseDate(fieldData);
  if (enteredDate && isValid(enteredDate)) {
    const today = parseDate(new Date().toISOString().split('T')[0]);
    const in180Days = add(today, { days: 180 });

    if (isBefore(enteredDate, today)) {
      errors.addError('Enter a future separation date');
    } else if (
      isAfter(enteredDate, in180Days) ||
      enteredDate.getTime() === in180Days.getTime()
    ) {
      errors.addError(
        'Enter a separation date less than 180 days in the future',
      );
    }
  }
};

/**
 * Validation for Release from Active Duty date and Activation date. Adds an
 * error if expected separation date is not after activation date.
 *
 * @param {Object} errors - Errors object from rjsf, which includes an addError method
 * @param {Object} pageData - The data associated with the current schema
 */
export const title10BeforeRad = (errors, pageData) => {
  const { anticipatedSeparationDate, title10ActivationDate } =
    pageData?.reservesNationalGuardService?.title10Activation || {};

  const rad = parseDate(anticipatedSeparationDate);
  const activation = parseDate(title10ActivationDate);

  if (
    rad &&
    isValid(rad) &&
    activation &&
    isValid(activation) &&
    isBefore(rad, activation) &&
    errors?.reservesNationalGuardService?.title10Activation
      ?.anticipatedSeparationDate?.addError
  ) {
    errors?.reservesNationalGuardService?.title10Activation?.anticipatedSeparationDate?.addError(
      'Enter an expected separation date that is after your activation date',
    );
  }
};

/**
 * Validates the given year is in a valid format. Adds an error if invalid
 * format numeric format or is in the future.
 * @param {Object} err - Errors object from rjsf, which includes an addError method
 * @param {string} fieldData - The data associated with the current schema. Year.
 */
export const isValidYear = (err, fieldData) => {
  const parsedInt = Number.parseInt(fieldData, 10);

  if (!/^\d{4}$/.test(fieldData) || parsedInt < 1900 || parsedInt > 3000) {
    err.addError('Please provide a valid year');
  }

  if (parsedInt > new Date().getFullYear()) {
    err.addError('The year can’t be in the future');
  }
};

/**
 * Verifies treatment start date is within service periods. Adds an error if
 * the start date is not after the start of the earliest service period.
 * @param {Object} err - Errors object from rjsf, which includes an addError method
 * @param {string} fieldData - The data associated with the current schema. Date
 * first visited the facility.
 * @param {Object} formData - Full formData for the form
 */
export function startedAfterServicePeriod(err, fieldData, formData) {
  if (!_.get('servicePeriods.length', formData.serviceInformation, false)) {
    return;
  }

  const { servicePeriods } = formData.serviceInformation;
  const earliestServiceDate = findEarliestServiceDate(servicePeriods);

  if (isMonthOnly(fieldData)) {
    err.addError('Enter a month and year.');
    return;
  }

  // For year-month format (YYYY-MM-XX), parse the first day of that month
  let treatmentDate;
  if (isYearMonth(fieldData)) {
    const yearMonth = fieldData.replace('-XX', '-01');
    treatmentDate = parseDate(yearMonth);
  } else {
    treatmentDate = parseDate(fieldData);
  }

  if (
    treatmentDate &&
    earliestServiceDate &&
    isTreatmentBeforeService(treatmentDate, earliestServiceDate, fieldData)
  ) {
    err.addError(
      'Your first treatment date needs to be after the start of your earliest service period.',
    );
  }
}

/**
 * Verifies the given dates are within service periods. Adds error if the dates
 * are not within a service period.
 * @param {Object} errors - Errors object from rjsf, which includes an addError method
 * @param {Object} fieldData - The data associated with the current schema. Dates of confinement.
 * @param {Object} formData - Full formData for the form
 * @param {Object} _schema - Schema for the form
 * @param {Object} _uiSchema - UI Schema object
 * @param {number} _index - If using an array, includes the index of the page
 * @param {Object} appStateData - Data from appStateSelector. Service information.
 */
export const isWithinServicePeriod = (
  errors,
  fieldData,
  formData,
  _schema,
  _uiSchema,
  _index,
  appStateData,
) => {
  // formData === fieldData on review & submit - see #20301
  const servicePeriods =
    formData?.serviceInformation?.servicePeriods ||
    appStateData?.serviceInformation?.servicePeriods ||
    [];
  const inServicePeriod = servicePeriods.some(pos =>
    isWithinRange(fieldData, pos.dateRange),
  );

  if (!inServicePeriod) {
    const dateIsComplete = dateString =>
      dateString && !dateString.includes('X');
    if (dateIsComplete(fieldData.from) && dateIsComplete(fieldData.to)) {
      errors.from.addError(
        getPOWValidationMessage(servicePeriods.map(period => period.dateRange)),
      );
      errors.to.addError('Please provide your service periods');
    }
  }
};

export const missingConditionMessage =
  'Enter a condition, diagnosis, or short description of your symptoms';
/**
 * Validates a given disability name for length and duplication.
 * @param {Object} err - Errors object from rjsf, which includes an addError method
 * @param {Object} fieldData - The data associated with the current schema. Disability name.
 * @param {Object} _formData - Full formData for the form
 * @param {Object} _schema - Schema for the form
 * @param {Object} _uiSchema - The UI Schema object
 * @param {number} _index - If using an array, includes the index of the page
 * @param {Object} appStateData - Data from appStateSelector
 */
export const validateDisabilityName = (
  err,
  fieldData = '',
  _formData,
  _schema,
  _uiSchema,
  _index,
  appStateData,
) => {
  // We're using a validator for length instead of adding a maxLength schema
  // property because the validator is only applied conditionally - when a user
  // chooses a disability from the list supplied to autosuggest, we don't care
  // about the length - we only care about the length of unique user-entered
  // disability names. We could've done this with `updateSchema` but this seems
  // lighter-touch.
  if (
    !LOWERED_DISABILITY_DESCRIPTIONS.includes(fieldData.toLowerCase()) &&
    fieldData.length > 255
  ) {
    err.addError('This needs to be less than 256 characters');
  }

  const missingCondition =
    !fieldData?.trim() ||
    fieldData.toLowerCase() === NULL_CONDITION_STRING.toLowerCase();

  if (missingCondition) {
    err.addError(missingConditionMessage);
  }

  // Alert Veteran to duplicates
  const currentList =
    appStateData?.newDisabilities?.map(disability =>
      disability.condition?.toLowerCase(),
    ) || [];
  // look for full text duplicates
  const itemLowerCased = fieldData?.toLowerCase() || '';
  // look for duplicates that may occur from stripping out
  const itemSippableId = sippableId(fieldData || '');
  const itemCount = currentList.filter(
    item => item === itemLowerCased || sippableId(item) === itemSippableId,
  );
  if (itemCount.length > 1) {
    err.addError('You’ve already added this condition to your claim');
  }
};

/**
 * Validates that a disability has been selected. Adds an error if appropriate disability
 * has not been chosen for the claim type.
 * @param {Object} err - Errors object from rjsf, which includes an addError method
 * @param {Object} fieldData - The data associated with the current schema. New conditions.
 * @param {Object} formData - Full formData for the form
 */
export const requireDisability = (err, fieldData, formData) => {
  if (!hasClaimedConditions(formData)) {
    // The actual validation error is displayed as an alert field. The message
    // here will be shown on the review page
    err.addError('Please select a disability');
  }
};

/**
 * Validation to enforce a max number of new disabilities. Adds an error when
 * user attempts to add more than 100 new disabilities.
 * @param {Object} err - Errors object from rjsf, which includes an addError method
 * @param {Object} fieldData - The data associated with the current schema.
 * @param {Object} formData - Full formData for the form
 */
export const limitNewDisabilities = (err, fieldData, formData) => {
  if (formData.newDisabilities?.length > 100) {
    err.addError(
      'You’ve added the maximum number of conditions. If you’d like to add another one, you’ll need to remove a condition from your claim.',
    );
  }
};

/**
 * Requires a rated disability to be entered if the increase only path has been selected.
 * @param {Object} err - Errors object from rjsf, which includes an addError method
 * @param {Object} fieldData - The data associated with the current schema. Rated disabilities.
 * @param {Object} formData - Full formData for the form
 */
export const requireRatedDisability = (err, fieldData, formData) => {
  if (isClaimingIncrease(formData) && !claimingRated(formData)) {
    // The actual validation error is displayed as an alert field. The message
    // here will be shown on the review page
    err.addError('Please select a rated disability');
  }
};

/**
 * Validates the separation location matches one of the auto suggested
 * locations. Adds an error if the location is not in the list.
 * @param {Object} err - Errors object from rjsf, which includes an addError method
 * @param {Object} fieldData - The data associated with the current schema. Separation location.
 * @param {Object} formData - Full formData for the form
 */
export const requireSeparationLocation = (err, fieldData, formData) => {
  if (showSeparationLocation(formData) && !fieldData?.id) {
    err.addError('Please select a separation location from the suggestions');
  }
};

/**
// Originally used the function from platform/forms-system/src/js/validation.js,
// but we need to ignore conditions that have been removed from the new
// disabilities array; the form data for treatedDisabilityNames doesn't remove
// previous entries and they may still be true - see
// https://github.com/department-of-veterans-affairs/va.gov-team/issues/15368
// the schema name is not altered, only the form data from SiPs
 * @param {Object} errors - Errors object from rjsf, which includes an addError method
 * @param {Object} userGroup
 * @param {Object} form - Full formData for the form
 * @param {Object} schema - Schema for the form
 * @param {Object} errorMessages - Error messages for the schema
 */
export function validateBooleanGroup(
  errors,
  userGroup,
  form,
  schema,
  errorMessages = {},
) {
  const { atLeastOne = 'Please choose at least one option' } = errorMessages;
  const group = userGroup || {};
  const props = schema?.properties || {};
  if (
    !Object.keys(group).filter(
      item =>
        group[item] === true && (props[item] || props[item.toLowerCase()]),
    ).length
  ) {
    errors.addError(atLeastOne);
  }
}

/* Military history validations */
/**
 * Validates the Active Start date against DOB. Adds an error if minimum age is
 * not met.
 * @param {Object} errors - Errors object from rjsf, which includes an addError method
 * @param {string} dateString - Active service start date
 * @param {Object} _formData - Full formData for the form
 * @param {Object} _schema - Schema for the form
 * @param {Object} _uiSchema - The UI Schema object
 * @param {number} _currentIndex - If using an array, includes the index of the page
 * @param {Object} appStateData - Data from appStateSelector
 */
export const validateAge = (
  errors,
  dateString,
  _formData,
  _schema,
  _uiSchema,
  _currentIndex,
  appStateData,
) => {
  const dob = parseDate(appStateData?.dob);
  const start = parseDate(dateString);

  // Bail if either date is missing/invalid
  if (!dob || !isValid(dob) || !start || !isValid(start)) {
    return;
  }

  const minStart = add(dob, { years: 13 });
  if (isBefore(start, minStart) || start.getTime() === minStart.getTime()) {
    errors.addError('Your start date must be after your 13th birthday');
  }
};

// partial matches for reserves
// NOAA & Public Health Service are considered to be active duty
const reservesList = Object.values(RESERVE_GUARD_TYPES);

/**
 * Validates Separation date for format, past, and future dates. Adds error if
 * date is invalid.
 * @param {Object} errors - Errors object from rjsf, which includes an addError method
 * @param {string} dateString - Active serviced end date
 * @param {Object} _formData - Full formData for the form
 * @param {Object} _schema - Schema for the form
 * @param {Object} _uiSchema - The UI Schema object
 * @param {number} currentIndex - If using an array, includes the index of the page
 * @param {Object} appStateData - Data from appStateSelector
 */
export const validateSeparationDate = (
  errors,
  dateString,
  _formData,
  _schema,
  _uiSchema,
  currentIndex,
  appStateData,
) => {
  const { isBDD, servicePeriods = [] } = appStateData;
  const branch = servicePeriods[currentIndex]?.serviceBranch || '';

  // Parse the date first to validate it
  const separationDate = parseDate(dateString);

  // Check if date is invalid
  if (!separationDate || !isValid(separationDate)) {
    errors.addError(
      `The separation date provided (${dateString}) is not a real date.`,
    );
    return;
  }

  // Get today as a Date object normalized to start of day to avoid time precision issues
  const today = startOfToday();

  // If a reservist is activated, they are considered to be active duty.
  // Inactive or active reserves may have a future separation date.
  // Regardless, no separation date should be greater than 180 days.
  const isReserves = reservesList.some(match => branch.includes(match));

  // Check if date is more than 180 days in the future (applies to both BDD and non-BDD)
  if (isAfter(separationDate, add(today, { days: 180 }))) {
    if (isBDD) {
      errors.addError(
        'Your separation date must be before 180 days from today',
      );
    } else {
      errors.addError(
        'You entered a date more than 180 days from now. If you are wanting to apply for the Benefits Delivery at Discharge program, you will need to wait.',
      );
    }
  } else if (
    !isBDD &&
    !isReserves &&
    isAfter(separationDate, add(today, { days: 90 }))
  ) {
    // For non-BDD active duty claims, separation date must not be more than 90 days in the future
    errors.addError('Your separation date must be in the past');
  }
};

/**
 * Validates service periods for reserve or national guard. Adds an error if
 * activation date is not after earliest reserve/guard start date.
 * @param {Object} errors - Errors object from rjsf, which includes an addError method
 * @param {string} dateString - Activation date (fieldData)
 * @param {Object} _formData - Full formData for the form
 * @param {Object} _schema - Schema for the form
 * @param {Object} _uiSchema - The UI Schema object
 * @param {number} _index - If using an array, includes the index of the page
 * @param {Object} appStateData - Data from appStateSelector
 */
export const validateTitle10StartDate = (
  errors,
  dateString,
  _formData,
  _schema,
  _uiSchema,
  _index,
  appStateData = {},
) => {
  const startTimes = (appStateData.servicePeriods || [])
    // include only reserve/guard service periods
    .filter(period =>
      reservesList.some(match => period.serviceBranch.includes(match)),
    )
    .map(period => period.dateRange.from)
    .sort((a, b) => {
      // string comparison of dates in the 'YYYY-MM-DD' format work as expected
      if (a === b) {
        return 0;
      }
      return b > a ? -1 : 1;
    });
  const activationDate = parseDate(dateString);
  const today = startOfToday();
  if (activationDate && isAfter(activationDate, today)) {
    errors.addError('Enter an activation date in the past');
  } else if (!startTimes[0] || dateString < startTimes[0]) {
    errors.addError(
      'Your activation date must be after your earliest service start date for the Reserve or the National Guard',
    );
  }
};
