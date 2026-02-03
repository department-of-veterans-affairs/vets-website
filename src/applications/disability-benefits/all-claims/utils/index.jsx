/* eslint-disable react/jsx-key */
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import * as Sentry from '@sentry/browser';
import fastLevenshtein from 'fast-levenshtein';
import { isValidYear } from 'platform/forms-system/src/js/utilities/validations';
import {
  checkboxGroupSchema,
  checkboxGroupUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { apiRequest } from 'platform/utilities/api';
import _ from 'platform/utilities/data';
import PropTypes from 'prop-types';
import React from 'react';
import { createSelector } from 'reselect';
import {
  add,
  endOfDay,
  getYear,
  isAfter,
  isBefore,
  isSameDay,
  isValid,
  isWithinInterval,
} from 'date-fns';
import {
  CHAR_LIMITS,
  DATA_PATHS,
  DISABILITY_526_V2_ROOT_URL,
  FORM_STATUS_BDD,
  HOMELESSNESS_TYPES,
  NEW_CONDITION_OPTION,
  NINE_ELEVEN,
  PAGE_TITLES,
  PTSD_MATCHES,
  RESERVE_GUARD_TYPES,
  SAVED_SEPARATION_DATE,
  START_TEXT,
  TYPO_THRESHOLD,
  USA,
  itfStatuses,
} from '../constants';
import { getBranches } from './serviceBranches';
import { setSharedVariable } from './sharedState';
import {
  formatDateRange,
  formatDate,
  parseDate,
  getToday,
} from './dates/formatting';

/**
 * Returns an object where all the fields are prefixed with `view:` if they aren't already
 */
export const viewifyFields = formData => {
  const newFormData = {};
  Object.keys(formData).forEach(key => {
    const viewKey = /^view:/.test(key) ? key : `view:${key}`;
    // Recurse if necessary
    newFormData[viewKey] =
      typeof formData[key] === 'object' && !Array.isArray(formData[key])
        ? viewifyFields(formData[key])
        : formData[key];
  });
  return newFormData;
};

/**
 * Show one thing, have a screen reader say another.
 *
 * @param {ReactElement|ReactComponent|String} srIgnored -- Thing to be displayed visually,
 *                                                           but ignored by screen readers
 * @param {String} substitutionText -- Text for screen readers to say instead of srIgnored
 */
export const srSubstitute = (srIgnored, substitutionText) => (
  <span>
    <span aria-hidden>{srIgnored}</span>
    <span className="sr-only">{substitutionText}</span>
  </span>
);

export const isUndefined = value => (value || '') === '';

// Check if expiration date is today or in the future
export const isNotExpired = (expirationDate = '') => {
  const today = new Date(getToday());
  const expiration = parseDate(expirationDate);
  if (!today || !expiration) return false;
  // Check if today is before or same as expiration (i.e., expiration is today or future)
  return isBefore(today, expiration) || isSameDay(today, expiration);
};

export const isValidFullDate = dateString => {
  // expecting dateString = 'yyyy-MM-dd'
  const date = parseDate(dateString);
  return (
    (date &&
      isValid(date) &&
      // date-fns parse('2021') would be invalid
      // date-fns parse('XXXX-01-01') would be invalid
      dateString === formatDate(date, 'yyyy-MM-dd') &&
      // make sure we're within the min & max year range
      isValidYear(getYear(date))) ||
    false
  );
};

export const isValidServicePeriod = data => {
  const { serviceBranch, dateRange: { from = '', to = '' } = {} } = data || {};
  return (
    (!isUndefined(serviceBranch) &&
      getBranches().includes(serviceBranch) &&
      !isUndefined(from) &&
      !isUndefined(to) &&
      isValidFullDate(from) &&
      isValidFullDate(to) &&
      isBefore(parseDate(from), parseDate(to))) ||
    false
  );
};

export const isActiveITF = currentITF => {
  if (currentITF) {
    const isActive = currentITF.status === itfStatuses.active;
    return isActive && isNotExpired(currentITF.expirationDate);
  }
  return false;
};

export const hasGuardOrReservePeriod = formData => {
  const serviceHistory = formData?.servicePeriods;
  if (!serviceHistory || !Array.isArray(serviceHistory)) {
    return false;
  }

  return serviceHistory.reduce((isGuardReserve, { serviceBranch }) => {
    // For a new service period, service branch defaults to undefined
    if (!serviceBranch) {
      return isGuardReserve;
    }
    const { nationalGuard, reserve } = RESERVE_GUARD_TYPES;
    return (
      isGuardReserve ||
      serviceBranch.includes(reserve) ||
      serviceBranch.includes(nationalGuard)
    );
  }, false);
};

export const ReservesGuardDescription = ({ formData }) => {
  const { servicePeriods } = formData || {};
  if (
    !servicePeriods ||
    !Array.isArray(servicePeriods) ||
    !servicePeriods[0].serviceBranch
  ) {
    return null;
  }

  const mostRecentPeriod = servicePeriods
    .filter(({ serviceBranch }) => {
      const { nationalGuard, reserve } = RESERVE_GUARD_TYPES;
      return (
        serviceBranch.includes(nationalGuard) || serviceBranch.includes(reserve)
      );
    })
    .map(({ serviceBranch, dateRange }) => {
      const dateTo = new Date(dateRange.to);
      return {
        serviceBranch,
        to: dateTo,
      };
    })
    .sort((periodA, periodB) => periodB.to - periodA.to)[0];

  if (!mostRecentPeriod) {
    return null;
  }
  const { serviceBranch, to } = mostRecentPeriod;
  return (
    <div>
      Please tell us more about your {serviceBranch} service that ended on{' '}
      {formatDate(to)}.
    </div>
  );
};

ReservesGuardDescription.propTypes = {
  formData: PropTypes.object,
};

export const title10DatesRequired = formData =>
  _.get(
    'serviceInformation.reservesNationalGuardService.view:isTitle10Activated',
    formData,
    false,
  );

const capitalizeWord = word => {
  const capFirstLetter = word[0].toUpperCase();
  return `${capFirstLetter}${word.slice(1)}`;
};

/**
 * Takes a string and returns the same string with every word capitalized. If no valid
 * string is given as input, returns NULL_CONDITION_STRING and logs to Sentry.
 * @param {string} name the lower-case name of a disability
 * @returns {string} the input name, but with all words capitalized
 */
export const capitalizeEachWord = name => {
  if (name && typeof name === 'string') {
    return name.replace(/\w[^\s-]*/g, capitalizeWord);
  }

  if (typeof name !== 'string') {
    Sentry.captureMessage(
      `form_526_v2: capitalizeEachWord requires 'name' argument of type 'string' but got ${typeof name}`,
    );
  }

  return null;
};

export const hasForwardingAddress = formData =>
  _.get('view:hasForwardingAddress', formData, false);

export const forwardingCountryIsUSA = formData =>
  _.get('forwardingAddress.country', formData, '') === USA;

export function getSeparationLocations() {
  return apiRequest('/disability_compensation_form/separation_locations')
    .then(({ separationLocations }) =>
      separationLocations.map(separationLocation => ({
        id: separationLocation.code,
        label: separationLocation.description,
      })),
    )
    .catch(error => {
      Sentry.withScope(scope => {
        scope.setExtra('error', error);
        Sentry.captureMessage('Error getting separation locations');
      });
      return [];
    });
}

export const disabilityIsSelected = disability => disability['view:selected'];

/**
 * Takes a string and returns another that won't break SiP when used
 * as a property name.
 * @param {string} str - The string to make SiP-friendly
 * @return {string} The SiP-friendly string
 */
const regexNonWord = /[^\w]/g;
export const sippableId = str =>
  (str || 'blank').replace(regexNonWord, '').toLowerCase();

// Helper to check if user is in evidence enhancement flow
export const isEvidenceEnhancement = formData =>
  !!formData?.disability526SupportingEvidenceEnhancement;

export const hasVAEvidence = formData =>
  _.get(DATA_PATHS.hasVAEvidence, formData, false);
export const hasOtherEvidence = formData =>
  _.get(DATA_PATHS.hasAdditionalDocuments, formData, false);
export const hasPrivateEvidence = formData =>
  _.get(DATA_PATHS.hasPrivateEvidence, formData, false);

export const hasMedicalRecords = formData => {
  if (isEvidenceEnhancement(formData)) {
    // Enhancement flow: check new field name, with fallback to legacy data for transition compatibility
    const hasRecords = _.get(DATA_PATHS.hasMedicalRecords, formData);
    if (hasRecords !== undefined) {
      return hasRecords;
    }
    // Transition compatibility: derive from legacy data if switching from legacy flow
    const hasLegacyEvidence = _.get(DATA_PATHS.hasEvidence, formData, false);
    const hasVA = hasVAEvidence(formData);
    const hasPrivate = hasPrivateEvidence(formData);
    return hasLegacyEvidence && (hasVA || hasPrivate);
  }
  // Legacy flow: use the existing path
  return _.get(DATA_PATHS.hasEvidence, formData, false);
};

/**
 * Inspects all given paths in the formData object for presence of values
 * @param {object} formData  full formData for the form
 * @param {array} fieldPaths full paths in formData for other fields that
 *                           should be checked for input
 * @returns {boolean} true if at least one path is not empty / false otherwise
 */
export const fieldsHaveInput = (formData, fieldPaths) =>
  fieldPaths.some(path => !!_.get(path, formData, ''));

export const bankFieldsHaveInput = formData =>
  fieldsHaveInput(formData, [
    'view:bankAccount.bankAccountType',
    'view:bankAccount.bankAccountNumber',
    'view:bankAccount.bankRoutingNumber',
    'view:bankAccount.bankName',
  ]);

/**
 * Returns the path with any ':index' substituted with the actual index.
 * @param {string} path - The path with or without ':index'
 * @param {number} index - The index to put in the string
 * @return {string}
 */
export const pathWithIndex = (path, index) => path.replace(':index', index);

const post911Periods = createSelector(
  data => _.get('serviceInformation.servicePeriods', data, []),
  periods =>
    periods.filter(({ dateRange }) => {
      if (!(dateRange && dateRange.to)) {
        return false;
      }

      const toDate = new Date(dateRange.to);
      const cutOff = new Date(NINE_ELEVEN);
      return toDate.getTime() > cutOff.getTime();
    }),
);

export const servedAfter911 = formData => !!post911Periods(formData).length;

export const isDisabilityPtsd = disability => {
  if (!disability || typeof disability !== 'string') {
    return false;
  }

  const strippedDisability = disability.toLowerCase().replace(/[^a-zA-Z]/g, '');

  return PTSD_MATCHES.some(ptsdString => {
    const strippedString = ptsdString.replace(/[^a-zA-Z]/g, '');
    if (strippedString === strippedDisability) {
      return true;
    }

    // does the veteran's input contain a string from our match list?
    if (strippedDisability.includes(strippedString)) {
      return true;
    }

    return (
      fastLevenshtein.get(strippedString, strippedDisability) <
      Math.ceil(strippedDisability.length * TYPO_THRESHOLD)
    );
  });
};

export const hasRatedDisabilities = formData =>
  formData?.ratedDisabilities?.length > 0;

export const isClaimingNew = formData =>
  _.get(
    'view:claimType.view:claimingNew',
    formData,
    // force default to true if user has no rated disabilities
    !hasRatedDisabilities(formData),
  );

export const isClaimingIncrease = formData =>
  _.get('view:claimType.view:claimingIncrease', formData, false);

export const isBDD = formData => {
  const isBddDataFlag = Boolean(formData?.['view:isBddData']);
  const servicePeriods = formData?.serviceInformation?.servicePeriods || [];

  // separation date entered in the wizard
  const separationDate = window.sessionStorage.getItem(SAVED_SEPARATION_DATE);

  // this flag helps maintain the correct form title within a session
  // Removed because of Cypress e2e tests don't have access to 'view:isBddData'
  // window.sessionStorage.removeItem(FORM_STATUS_BDD);

  // isActiveDuty is true when the user selects that option in the wizard & then
  // enters a separation date - based on the session storage value; we then
  // set this flag in the formData.
  // If the user doesn't choose the active duty wizard option, but enters a
  // future date in their service history, this may be associated with reserves
  // and therefor should not open the BDD flow
  const isActiveDuty = isBddDataFlag || separationDate;

  if (
    !isActiveDuty ||
    // User hasn't started the form or the wizard
    (servicePeriods.length === 0 && !separationDate)
  ) {
    return false;
  }

  const mostRecentDate = separationDate
    ? parseDate(separationDate)
    : servicePeriods
        .filter(({ dateRange }) => dateRange?.to)
        .map(({ dateRange }) => parseDate(dateRange?.to))
        .sort((dateA, dateB) => dateB - dateA)[0];

  if (!mostRecentDate) {
    window.sessionStorage.setItem(FORM_STATUS_BDD, 'false');
    return false;
  }

  const today = getToday();
  const today89 = add(today, { days: 89 });
  const today180 = add(today, { days: 180 });

  const result =
    isActiveDuty &&
    isAfter(mostRecentDate, today89) &&
    !isAfter(mostRecentDate, today180);

  // this flag helps maintain the correct form title within a session
  window.sessionStorage.setItem(FORM_STATUS_BDD, result ? 'true' : 'false');
  return Boolean(result);
};

// TODO: Once vetted, drop the feature toggle _and_ drop this obsolete
// conditionality.
export const showNewlyBDDPages = formData => {
  return formData.disability526ExtraBDDPagesEnabled || !isBDD(formData);
};

export const hasNewPtsdDisability = formData =>
  !isBDD(formData) &&
  isClaimingNew(formData) &&
  _.get('newDisabilities', formData, []).some(disability =>
    isDisabilityPtsd(disability.condition),
  ) &&
  // hasNewPtsdDisability gates the existing Form 0781 flow
  // When the syncModern0781Flow flipper is set to true, we will display a new version of the flow.
  // When the new version is visible, hasNewPtsdDisability should always return false so the legacy flow is hidden.
  formData?.syncModern0781Flow !== true;

export const showPtsdCombat = formData =>
  hasNewPtsdDisability(formData) &&
  _.get('view:selectablePtsdTypes.view:combatPtsdType', formData, false);

export const showPtsdNonCombat = formData =>
  hasNewPtsdDisability(formData) &&
  _.get('view:selectablePtsdTypes.view:nonCombatPtsdType', formData, false) &&
  // skip non-combat question if Veteran says yes to combat question
  !_.get('skip781ForCombatReason', formData, false);

export const skip781 = formData =>
  _.get('skip781ForCombatReason', formData) === true ||
  _.get('skip781ForNonCombatReason', formData) === true;

export const needsToEnter781 = formData =>
  hasNewPtsdDisability(formData) &&
  (showPtsdCombat(formData) || showPtsdNonCombat(formData)) &&
  !skip781(formData);

export const needsToEnter781a = formData =>
  hasNewPtsdDisability(formData) &&
  (_.get('view:selectablePtsdTypes.view:mstPtsdType', formData, false) ||
    _.get('view:selectablePtsdTypes.view:assaultPtsdType', formData, false));

export const isUploading781Form = formData =>
  _.get('view:upload781Choice', formData, '') === 'upload';

export const isUploading781aForm = formData =>
  _.get('view:upload781aChoice', formData, '') === 'upload';

export const isAnswering781Questions = index => formData =>
  needsToEnter781(formData) &&
  _.get('view:upload781Choice', formData, '') === 'answerQuestions' &&
  (_.get(`view:enterAdditionalEvents${index - 1}`, formData, false) ||
    index === 0);

export const isAnswering781aQuestions = index => formData =>
  needsToEnter781a(formData) &&
  _.get('view:upload781aChoice', formData, '') === 'answerQuestions' &&
  (_.get(`view:enterAdditionalSecondaryEvents${index - 1}`, formData, false) ||
    index === 0);

export const isUploading781aSupportingDocuments = index => formData =>
  isAnswering781aQuestions(index)(formData) &&
  _.get(`secondaryIncident${index}.view:uploadSources`, formData, false);

export const isAddingIndividuals = index => formData =>
  isAnswering781Questions(index)(formData) &&
  _.get(`view:individualsInvolved${index}`, formData, false);

export const isUploading8940Form = formData =>
  _.get('view:unemployabilityUploadChoice', formData, '') === 'upload';

export const getHomelessOrAtRisk = formData => {
  const homelessStatus = _.get('homelessOrAtRisk', formData, '');
  return (
    homelessStatus === HOMELESSNESS_TYPES.homeless ||
    homelessStatus === HOMELESSNESS_TYPES.atRisk
  );
};

export const isNotUploadingPrivateMedical = formData =>
  _.get(DATA_PATHS.hasPrivateRecordsToUpload, formData) === false;

export const hasCompletedAuthorization = value => value === true;

export const needsToEnterUnemployability = formData =>
  _.get('view:unemployable', formData, false);

export const needsToAnswerUnemployability = formData =>
  needsToEnterUnemployability(formData) &&
  _.get('view:unemployabilityUploadChoice', formData, '') === 'answerQuestions';

export const hasDoctorsCare = formData =>
  needsToAnswerUnemployability(formData) &&
  _.get('unemployability.underDoctorsCare', formData, false);

export const hasHospitalCare = formData =>
  needsToAnswerUnemployability(formData) &&
  _.get('unemployability.hospitalized', formData, false);

export const isUploadingSupporting8940Documents = formData =>
  needsToAnswerUnemployability(formData) &&
  _.get('view:uploadUnemployabilitySupportingDocumentsChoice', formData, false);

export const wantsHelpWithOtherSourcesSecondary = index => formData =>
  _.get(`secondaryIncident${index}.otherSources`, formData, '') &&
  isAnswering781aQuestions(index)(formData);

export const wantsHelpWithPrivateRecordsSecondary = index => formData =>
  _.get(
    `secondaryIncident${index}.otherSourcesHelp.view:helpPrivateMedicalTreatment`,
    formData,
    '',
  ) &&
  isAnswering781aQuestions(index)(formData) &&
  wantsHelpWithOtherSourcesSecondary(index)(formData);

export const wantsHelpRequestingStatementsSecondary = index => formData =>
  _.get(
    `secondaryIncident${index}.otherSourcesHelp.view:helpRequestingStatements`,
    formData,
    '',
  ) &&
  isAnswering781aQuestions(index)(formData) &&
  wantsHelpWithOtherSourcesSecondary(index)(formData);

const isDateRange = ({ from, to }) => !!(from && to);

// NOTE: Could move this to outside all-claims
/**
 * Checks to see if the first parameter is inside the date range (second parameter).
 * If the first parameter is a date range, it'll return true if both dates are inside the range.
 * @typedef {Object} DateRange
 * @property {string} to - A date string YYYY-MM-DD
 * @property {string} from - A date string YYYY-MM-DD
 * ---
 * @param {String|DateRange} inside - The date or date range to check
 * @param {DateRange} outside - The range `inside` must fit in
 * @param {String} inclusivity - See https://momentjs.com/docs/#/query/is-between/
 *                               NOTE: This function defaults to inclusive dates which is different
 *                               from moment's default
 */
export const isWithinRange = (inside, outside, inclusivity = '[]') => {
  if (isDateRange(inside)) {
    return (
      isWithinRange(inside.to, outside, inclusivity) &&
      isWithinRange(inside.from, outside, inclusivity)
    );
  }
  if (typeof inside !== 'string') return false;

  const insideDate = parseDate(inside);
  const from = parseDate(outside.from);
  const to = parseDate(outside.to);

  if (!insideDate || !from || !to) return false;
  if (!isValid(insideDate) || !isValid(from) || !isValid(to)) return false;

  // isWithinInterval is inclusive by default, matching inclusivity='[]'
  return isWithinInterval(insideDate, { start: from, end: to });
};

// This is in here instead of validations.js because it returns a jsx element
export const getPOWValidationMessage = servicePeriodDateRanges => (
  <span>
    The dates you enter must be within one of the service periods you entered.
    <ul>
      {servicePeriodDateRanges.map((range, index) => (
        <li key={index}>{formatDateRange(range)}</li>
      ))}
    </ul>
  </span>
);

export const increaseOnly = formData =>
  isClaimingIncrease(formData) && !isClaimingNew(formData);
export const newConditionsOnly = formData =>
  !isClaimingIncrease(formData) && isClaimingNew(formData);
export const newAndIncrease = formData =>
  isClaimingNew(formData) && isClaimingIncrease(formData);

// Shouldn't be possible, but just in case this requirement is lifted later...
export const noClaimTypeSelected = formData =>
  !isClaimingNew(formData) && !isClaimingIncrease(formData);

/**
 * The base urls for each form
 * @readonly
 * @enum {String}
 */
export const urls = {
  v2: DISABILITY_526_V2_ROOT_URL,
};

/**
 * Returns the base url of whichever form the user needs to go to.
 *
 * @param {Object} formData - The saved form data
 * @param {Boolean} isPrefill - True if formData comes from pre-fill, false if it's a saved form
 * @return {String} - The base url of the right form to return to
 */

export const claimingRated = formData =>
  formData?.ratedDisabilities?.some(d => d['view:selected']);

export const isPlaceholderRated = v => v === 'Rated Disability';

export const isNewConditionOption = v => v === NEW_CONDITION_OPTION;

// TE/POW should only show when there’s at least one *real* condition
export const hasRealNewOrSecondaryConditions = formData =>
  Array.isArray(formData?.newDisabilities) &&
  formData.newDisabilities.some(
    d =>
      typeof d?.condition === 'string' &&
      !isPlaceholderRated(d.condition) &&
      (d?.cause === 'NEW' || d?.cause === 'SECONDARY'),
  );
// TODO: Rename this to avoid collision with `isClaimingNew` above
export const claimingNew = formData =>
  formData?.newDisabilities?.some(d => d.condition);

export const hasClaimedConditions = formData =>
  (isClaimingIncrease(formData) && claimingRated(formData)) ||
  (isClaimingNew(formData) && claimingNew(formData));

/**
 * Finds active service periods—those without end dates or end dates
 * in the future.
 */
export const activeServicePeriods = formData =>
  _.get('serviceInformation.servicePeriods', formData, []).filter(
    sp => !sp.dateRange.to || isAfter(parseDate(sp.dateRange.to), getToday()),
  );

export const isUploadingSTR = formData =>
  isBDD(formData) &&
  _.get(
    'view:uploadServiceTreatmentRecordsQualifier.view:hasServiceTreatmentRecordsToUpload',
    formData,
    false,
  );

export const DISABILITY_SHARED_CONFIG = {
  orientation: {
    path: 'disabilities/orientation',
    // Only show the page if both (or potentially neither) options are chosen on the claim-type page
    depends: formData => newAndIncrease(formData) && !isBDD(formData),
  },
  ratedDisabilities: {
    path: 'disabilities/rated-disabilities',
    depends: formData => isClaimingIncrease(formData),
  },
  addDisabilities: {
    path: 'new-disabilities/add',
    depends: isClaimingNew,
  },
};

export const getPageTitle = formData => {
  const showBDDTitle =
    formData === true ||
    isBDD(formData) ||
    window.sessionStorage.getItem(FORM_STATUS_BDD) === 'true';
  return PAGE_TITLES[showBDDTitle ? 'BDD' : 'ALL'];
};

// Intro page doesn't have formData
export const getStartText = isBDDForm => {
  const showBDDText =
    isBDDForm ||
    isBDD() ||
    window.sessionStorage.getItem(FORM_STATUS_BDD) === 'true';
  return START_TEXT[showBDDText ? 'BDD' : 'ALL'];
};

export const showSeparationLocation = formData => {
  const { serviceInformation = {} } = formData || {};
  const { servicePeriods, reservesNationalGuardService } = serviceInformation;

  // moment(undefined) => today
  // moment(null) => Invalid date
  const title10SeparationDate = parseDate(
    reservesNationalGuardService?.title10Activation
      ?.anticipatedSeparationDate || null,
  );

  if (
    (!title10SeparationDate || !isValid(title10SeparationDate)) &&
    (!servicePeriods || !Array.isArray(servicePeriods))
  ) {
    return false;
  }

  const today = getToday();
  const todayPlus180 = add(today, { days: 180 });

  // Show separation location field if activated on federal orders & < 180 days
  if (
    title10SeparationDate &&
    isValid(title10SeparationDate) &&
    isAfter(title10SeparationDate, today) &&
    !isAfter(title10SeparationDate, todayPlus180)
  ) {
    return true;
  }

  const mostRecentDate = servicePeriods
    ?.filter(({ dateRange }) => dateRange?.to)
    .map(({ dateRange }) => parseDate(dateRange.to))
    .filter(date => date && isValid(date))
    .sort((dateA, dateB) => dateB - dateA)[0];

  return mostRecentDate
    ? isAfter(mostRecentDate, today) && !isAfter(mostRecentDate, todayPlus180)
    : false;
};

export const show526Wizard = state => toggleValues(state).show526Wizard;

export const showSubform8940And4192 = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.subform89404192];

/**
 * Selector to check if the toxic exposure destruction modal feature flag is enabled.
 * @param {Object} state - Redux state object
 * @returns {boolean} True if the feature flag is enabled, false otherwise
 */
export const showToxicExposureDestructionModal = state =>
  toggleValues(state).disabilityCompensationToxicExposureDestructionModal;

/**
 * Selector to check if the toxic exposure opt-out data purge feature flag is enabled.
 * @param {Object} state - Redux state object
 * @returns {boolean} True if the feature flag is enabled, false otherwise
 */
export const showToxicExposureOptOutDataPurge = state =>
  toggleValues(state).disability526ToxicExposureOptOutDataPurge;

export const wrapWithBreadcrumb = (title, component) => (
  <>
    <div className="row vads-u-padding-x--1p5">
      <VaBreadcrumbs
        uswds
        breadcrumbList={[
          { href: '/', label: 'Home' },
          { href: '/disability', label: 'Disability Benefits' },
          {
            href: '/disability/file-disability-claim-form-21-526ez',
            label: title,
          },
        ]}
      />
    </div>
    {component}
  </>
);

/**
 * Determines if a given date object is expired.
 *
 * Usability:
 * - Use this utility to check if a date (with an `expiresAt` property in seconds since epoch)
 *   has already passed or is still valid. We want to use epoch here as that's what the backend
 *   ruby services are expecting for this value.
 * - Returns `true` if the date is missing, invalid, or has expired; otherwise, returns `false`.
 *
 * @param {Object} date - An object containing an `expiresAt` property (seconds since epoch).
 * @returns {boolean} `true` if expired or invalid, `false` if still valid.
 */
export const isExpired = date => {
  if (!date) {
    return true;
  }
  // expiresAt: Ruby saves as time from Epoch date in seconds (not milliseconds)
  // Convert the expiresAt (seconds since epoch) to a date string (YYYY-MM-DD)
  const expiresAt = date?.expiresAt;
  let expires = null;
  if (expiresAt) {
    const expiresDate = new Date(expiresAt * 1000);
    const expiresDateString = expiresDate.toISOString().split('T')[0];
    expires = parseDate(expiresDateString);
  }
  // Calculate today inside the function so it works with test mocking
  const today = endOfDay(new Date(getToday()));
  return !(
    expires &&
    (isAfter(endOfDay(expires), today) || isSameDay(endOfDay(expires), today))
  );
};

/**
 * @typedef NewDisability~entry
 * @property {String} condition - disability name
 * @property {String} cause - disability type
 * @property {String} primaryDescription - new disability description
 * @property {String} causedByDisabilityDescription - name of rated disability
 * @property {String} worsenedDescription - worsened description
 * @property {String} worsenedEffects - result
 * @property {String} vaMistreatmentDescription - VA involved
 * @property {String} vaMistreatmentLocation - location
 * @property {String} vaMistreatmentDate - date
 */
/**
 * Truncate long descriptions
 * @param {NewDisability~entry} data - new disability array entry
 * @returns new disability array entry with over-the-limit descriptions
 *  truncated
 */
export const truncateDescriptions = data =>
  Object.keys(data).reduce(
    (entry, key) => ({
      ...entry,
      [key]:
        key in CHAR_LIMITS
          ? data[key].substring(0, CHAR_LIMITS[key])
          : data[key],
    }),
    {},
  );

/**
 * Creates consistent form title
 * @param {string} title
 * @returns {string} markup with h3 tag and consistent styling
 */
export const formTitle = title => (
  <h3 className="vads-u-font-size--h4 vads-u-color--base vads-u-margin--0">
    {title}
  </h3>
);

/**
 * Creates consistent form subtitle
 * @param {string} subtitle
 * @returns {string} markup with h4 tag and consistent styling
 */
export const formSubtitle = subtitle => (
  <h4 className="vads-u-font-size--h5 vads-u-color--gray-dark">{subtitle}</h4>
);

/**
 * Creates a consistent checkbox group UI configuration for conditions
 */
export function makeConditionsUI({
  title,
  description,
  hint,
  replaceSchema,
  updateUiSchema,
}) {
  return checkboxGroupUI({
    title,
    description,
    hint,
    labels: {},
    required: false,
    replaceSchema,
    updateUiSchema,
  });
}

/**
 * Adds an error if the 'none' checkbox is selected along with a new condition
 * @param {object} conditions - Conditions object containing the state of various checkboxes
 * @param {object} errors - Errors object from rjsf
 * @param {string} errorKey - Identifies the section to which the error belongs
 * @param {string} errorMessage - Specific message for 'none' checkbox conflict
 */
export function validateConditions(conditions, errors, errorKey, errorMessage) {
  if (
    conditions?.none === true &&
    Object.values(conditions).filter(value => value === true).length > 1
  ) {
    errors[errorKey].conditions.addError(errorMessage);
  }
}

/**
 * Builds the Schema based on user entered condition names
 * @param {object} formData - Full formData for the form
 * @returns {object} - Object with ids for each condition
 */
export function makeConditionsSchema(formData) {
  // Map only valid conditions and filter out 'blank' and other invalid values (null, empty strings, etc.)
  const options = (formData?.newDisabilities || [])
    .map(disability => disability.condition)
    .filter(
      condition =>
        condition && condition.trim() !== '' && condition !== 'blank',
    ); // Remove 'blank' and invalid conditions

  // Map conditions to sippable IDs
  const sippableOptions = options.map(condition => sippableId(condition));
  sippableOptions.push('none');

  return checkboxGroupSchema(sippableOptions);
}

/**
 * Formats the parts of a fullName object into a single string, e.g. "Hector Lee Brooks Jr."
 *
 * @param {object} fullName - Object holding name parts
 * @returns {string} Name formatted into a single string. Empty string if all parts are missing.
 */
export const formatFullName = (fullName = {}) => {
  let res = '';
  if (fullName?.first) {
    res += fullName.first;
  }
  if (fullName?.middle) {
    res += ` ${fullName.middle}`;
  }
  if (fullName?.last) {
    res += ` ${fullName.last}`;
  }
  if (fullName?.suffix) {
    res += ` ${fullName.suffix}`;
  }

  return res.trim();
};

/**
 * Checks if
 * 1. The flag for the modern 4142 flow is enabled
 *
 * @param {object} formData
 * @returns {boolean} true if disability526Enable2024Form4142 is present, false otherwise
 */
export function isCompletingModern4142(formData) {
  return formData?.disability526Enable2024Form4142 === true;
}

export const modern4142AuthURL =
  '/supporting-evidence/private-medical-records-authorize-release';

export const legacy4142AuthURL = '/supporting-evidence/private-medical-records';

export const evidenceChoiceURL = '/supporting-evidence/evidence-types';

export const minimum4142Setup = formData => {
  return (
    formData?.['view:hasEvidence'] === true &&
    // And the user is still choosing to include private records
    formData?.['view:selectableEvidenceTypes']?.[
      'view:hasPrivateMedicalRecords'
    ] === true
  );
};

export const baseDoNew4142Logic = formData => {
  return (
    // If flipper is enabled
    formData.disability526Enable2024Form4142 === true &&
    // And the user has evidence for review
    minimum4142Setup(formData) === true &&
    // And the user has previously acknowledged the 4142 authorization
    formData['view:patientAcknowledgement']?.['view:acknowledgement'] ===
      true &&
    // And the user has not switched to another 4142 option (e.g. upload)
    formData?.['view:uploadPrivateRecordsQualifier']?.[
      'view:hasPrivateRecordsToUpload'
    ] !== true &&
    // And the user has not already acknowledged the NEW 4142
    formData?.patient4142Acknowledgement !== true
    // then we must redirect them and show the alert
  );
};

export const redirectWhenFlipperOff = props => {
  const { returnUrl, formData } = props;
  return (
    minimum4142Setup(formData) === true &&
    returnUrl === modern4142AuthURL &&
    formData.disability526Enable2024Form4142 !== true
  );
};

export const redirectWhenNoEvidence = props => {
  const { returnUrl, formData } = props;
  return (
    formData?.['view:hasEvidence'] === false &&
    (returnUrl === modern4142AuthURL || returnUrl === legacy4142AuthURL)
  );
};

/**
 * Determines if user should be redirected from legacy evidence page to enhancement page
 * @param {Object} props - { returnUrl, formData }
 * @returns {boolean} true if redirect needed
 */
export const redirectLegacyToEnhancement = props => {
  const { returnUrl, formData } = props;
  return (
    returnUrl === '/supporting-evidence/evidence-types' &&
    isEvidenceEnhancement(formData)
  );
};

/**
 * Determines if user should be redirected from enhancement evidence pages to legacy page
 * @param {Object} props - { returnUrl, formData }
 * @returns {boolean} true if redirect needed
 */
export const redirectEnhancementToLegacy = props => {
  const { returnUrl, formData } = props;
  const isEnhancement = isEvidenceEnhancement(formData);
  return (
    !isEnhancement &&
    (returnUrl === '/supporting-evidence/evidence-request' ||
      returnUrl === '/supporting-evidence/medical-records')
  );
};

export const isNewConditionsOn = formData =>
  !!formData?.disabilityCompNewConditionsWorkflow;

export const isNewConditionsOff = formData => !isNewConditionsOn(formData);

export const onFormLoaded = props => {
  const { returnUrl, formData, router } = props;
  const shouldRedirectToModern4142Choice = baseDoNew4142Logic(formData);
  const shouldRevertWhenFlipperOff = redirectWhenFlipperOff(props);
  const shouldRevertWhenNoEvidence = redirectWhenNoEvidence(props);
  const shouldRedirectLegacyToEnhancement = redirectLegacyToEnhancement(props);
  const shouldRedirectEnhancementToLegacy = redirectEnhancementToLegacy(props);
  const redirectUrl = legacy4142AuthURL;

  if (shouldRedirectToModern4142Choice === true) {
    // if we should redirect to the modern 4142 choice page, we set the shared variable
    // and redirect to the redirectUrl (the modern 4142 choice page)
    setSharedVariable('alertNeedsShown4142', shouldRedirectToModern4142Choice);
    router.push(redirectUrl);
  } else if (
    // if the returnUrl is the modern 4142 choice page and the flipper is not enabled,
    // then we toggled flipper on, the user got to this page, then we turned the flipper off
    // this happens a lot in development and testing but would only happen if we do a rollback in production
    // if the user is set to redirect to a page that is set to be hidden they get stuck in a loop so we must place them on the previous page
    shouldRedirectToModern4142Choice === false &&
    shouldRevertWhenFlipperOff === true
  ) {
    router.push(redirectUrl);
  } else if (
    shouldRedirectToModern4142Choice === false &&
    shouldRevertWhenNoEvidence === true
  ) {
    router.push('/supporting-evidence/evidence-types');
  } else if (shouldRedirectLegacyToEnhancement === true) {
    // Handle evidence enhancement flow transition: legacy → enhancement
    router.push('/supporting-evidence/evidence-request');
  } else if (shouldRedirectEnhancementToLegacy === true) {
    // Handle evidence enhancement flow transition: enhancement → legacy
    router.push('/supporting-evidence/evidence-types');
  } else {
    // otherwise, we just redirect to the returnUrl as usual when resuming a form
    router.push(returnUrl);
  }
};

/**
 * Checks if
 * Veteran has additional evidence to upload within the 0781 flow
 * @param {object} formData
 * @returns {boolean} true if hasEvidenceChoice is present, false otherwise
 */
export const hasEvidenceChoice = formData => {
  return formData?.['view:hasEvidenceChoice'] === true;
};
