import _ from 'platform/utilities/data';
import some from 'lodash/some';
import moment from 'moment';

import {
  isWithinRange,
  getPOWValidationMessage,
  pathWithIndex,
  hasClaimedConditions,
  isClaimingIncrease,
  hasRatedDisabilities,
  claimingRated,
  showSeparationLocation,
  sippableId,
} from './utils';

import {
  MILITARY_CITIES,
  MILITARY_STATE_VALUES,
  LOWERED_DISABILITY_DESCRIPTIONS,
  NULL_CONDITION_STRING,
} from './constants';

export const hasMilitaryRetiredPay = data =>
  _.get('view:hasMilitaryRetiredPay', data, false);

export const hasTrainingPay = data => _.get('view:hasTrainingPay', data, false);

export function isValidZIP(value) {
  if (value !== null) {
    return /^\d{5}(?:(?:[-\s])?\d{4})?$/.test(value);
  }
  return true;
}

export function validateZIP(errors, zip) {
  if (zip && !isValidZIP(zip)) {
    errors.addError(
      'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
    );
  }
}

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

export const isLessThan180DaysInFuture = (errors, fieldData) => {
  const enteredDate = moment(fieldData);
  const in180Days = moment().add(180, 'days');
  if (enteredDate.isValid()) {
    if (enteredDate.isBefore()) {
      errors.addError('Please enter a future separation date');
    } else if (enteredDate.isSameOrAfter(in180Days)) {
      errors.addError(
        'Please enter a separation date less than 180 days in the future',
      );
    }
  }
};

export const title10BeforeRad = (errors, pageData) => {
  const { anticipatedSeparationDate, title10ActivationDate } =
    pageData?.reservesNationalGuardService?.title10Activation || {};

  const rad = moment(anticipatedSeparationDate);
  const activation = moment(title10ActivationDate);

  if (rad.isValid() && activation.isValid() && rad.isBefore(activation)) {
    errors.reservesNationalGuardService.title10Activation.anticipatedSeparationDate.addError(
      'Please enter an expected separation date that is after your activation date',
    );
  }
};

export const isValidYear = (err, fieldData) => {
  const parsedInt = Number.parseInt(fieldData, 10);

  if (!/^\d{4}$/.test(fieldData) || parsedInt < 1900 || parsedInt > 3000) {
    err.addError('Please provide a valid year');
  }

  if (parsedInt > new Date().getFullYear()) {
    err.addError('The year can’t be in the future');
  }
};

export function startedAfterServicePeriod(err, fieldData, formData) {
  if (!_.get('servicePeriods.length', formData.serviceInformation, false)) {
    return;
  }

  // find the earliest service period
  const earliestServiceStartDate = formData.serviceInformation.servicePeriods
    .filter(({ serviceBranch } = {}) => (serviceBranch || '') !== '')
    .map(period => moment(period.dateRange.from, 'YYYY-MM-DD'))
    .reduce(
      (earliestDate, current) =>
        current.isBefore(earliestDate) ? current : earliestDate,
      moment(),
    );

  const treatmentStartDate = moment(fieldData, 'YYYY-MM');
  // If the moment is earlier than the moment passed to moment.diff(),
  // the return value will be negative.
  if (treatmentStartDate.diff(earliestServiceStartDate, 'month') < 0) {
    err.addError(
      'Your first treatment date needs to be after the start of your earliest service period.',
    );
  }
}

// Doesn't require a complete date; just month and year
export const hasMonthYear = (err, fieldData) => {
  if (!fieldData) return;

  const [year, month] = fieldData.split('-');

  if (year === 'XXXX' || month === 'XX') {
    err.addError('Please provide both month and year');
  }
};

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
  'Please enter a condition or select one from the suggested list';

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
    err.addError('Condition names should be less than 256 characters');
  }

  if (
    !fieldData ||
    fieldData.toLowerCase() === NULL_CONDITION_STRING.toLowerCase()
  ) {
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
    err.addError('Please enter a unique condition name');
  }
};

export const requireDisability = (err, fieldData, formData) => {
  if (!hasClaimedConditions(formData)) {
    // The actual validation error is displayed as an alert field. The message
    // here will be shown on the review page
    err.addError('Please select a disability');
  }
};

export const limitNewDisabilities = (err, fieldData, formData) => {
  if (formData.newDisabilities?.length > 100) {
    err.addError(
      'You have reached the 100 condition limit. If you need to add another condition, you must remove a previously added condition.',
    );
  }
};

/**
 * Requires a rated disability to be entered if the increase only path has been selected.
 */
export const requireRatedDisability = (err, fieldData, formData) => {
  if (isClaimingIncrease(formData) && !claimingRated(formData)) {
    // The actual validation error is displayed as an alert field. The message
    // here will be shown on the review page
    err.addError('Please select a rated disability');
  }
};

/**
 * Require "yes" for "do you want to add new conditions" if no rated conditions
 *  have been selected.
 */
export const requireNewDisability = (err, fieldData, formData) => {
  if (!claimingRated(formData) && !fieldData) {
    const message = hasRatedDisabilities(formData)
      ? 'No rated disability selected. Please add a new one'
      : 'We didn’t find any existing rated disabilities. Please choose to add a new one';
    // The actual validation error is displayed as an alert field. The message
    // here will be shown on the review page
    err.addError(message);
  }
};

export const requireSeparationLocation = (err, fieldData, formData) => {
  if (showSeparationLocation(formData) && !fieldData?.id) {
    err.addError('Please select a separation location from the suggestions');
  }
};

// Originally used the function from platform/forms-system/src/js/validation.js,
// but we need to ignore conditions that have been removed from the new
// disabilities array; the form data for treatedDisabilityNames doesn't remove
// previous entries and they may still be true - see
// https://github.com/department-of-veterans-affairs/va.gov-team/issues/15368
// the schema name is not altered, only the form data from SiPs
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
export const validateAge = (
  errors,
  dateString,
  _formData,
  _schema,
  _uiSchema,
  _currentIndex,
  appStateData,
) => {
  if (moment(dateString).isBefore(moment(appStateData.dob).add(13, 'years'))) {
    errors.addError('Your start date must be after your 13th birthday');
  }
};

// partial matches for reserves
// NOAA & Public Health Service are considered to be active duty
const reservesList = ['Reserve', 'National Guard'];

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
  const isReserves = reservesList.some(match => branch.includes(match));
  const in90Days = moment().add(90, 'days');
  if (!isBDD && !isReserves && moment(dateString).isSameOrAfter(in90Days)) {
    errors.addError('Your separation date must be in the past');
  } else if (
    +isBDD &&
    !isReserves &&
    moment(dateString).isAfter(moment().add(180, 'days'))
  ) {
    errors.addError('Your separation date must be before 180 days from today');
  }
};

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
  if (!startTimes[0] || dateString < startTimes[0]) {
    errors.addError(
      'Your activation date must be after your earliest service start date for the Reserve or the National Guard',
    );
  }
};
