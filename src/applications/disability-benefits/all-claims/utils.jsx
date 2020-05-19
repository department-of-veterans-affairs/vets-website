/* eslint-disable react/jsx-key */
import React from 'react';
import moment from 'moment';
import * as Sentry from '@sentry/browser';
import appendQuery from 'append-query';
import { createSelector } from 'reselect';
import { omit } from 'lodash';
import merge from 'lodash/merge';
import fastLevenshtein from 'fast-levenshtein';
import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';
import _ from 'platform/utilities/data';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import disability526Manifest from 'applications/disability-benefits/526EZ/manifest.json';
import {
  validateMilitaryCity,
  validateMilitaryState,
  validateZIP,
} from './validations';
import ReviewCardField from 'platform/forms-system/src/js/components/ReviewCardField';
import AddressViewField from 'platform/forms-system/src/js/components/AddressViewField';

import {
  DATA_PATHS,
  DISABILITY_526_V2_ROOT_URL,
  HOMELESSNESS_TYPES,
  MILITARY_CITIES,
  MILITARY_STATE_LABELS,
  MILITARY_STATE_VALUES,
  NINE_ELEVEN,
  PTSD_MATCHES,
  RESERVE_GUARD_TYPES,
  STATE_LABELS,
  STATE_VALUES,
  TWENTY_FIVE_MB,
  USA,
  TYPO_THRESHOLD,
  itfStatuses,
  NULL_CONDITION_STRING,
} from './constants';

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

// moment().isSameOrBefore() => true; so expirationDate can't be undefined
export const isNotExpired = (expirationDate = '') =>
  moment().isSameOrBefore(expirationDate);

export const isActiveITF = currentITF => {
  if (currentITF) {
    const isActive = currentITF.status === itfStatuses.active;
    return isActive && isNotExpired(currentITF.expirationDate);
  }
  return false;
};

export const hasGuardOrReservePeriod = formData => {
  const serviceHistory = formData.servicePeriods;
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
  const { servicePeriods } = formData;
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
      {moment(to).format('MMMM DD, YYYY')}.
    </div>
  );
};

export const title10DatesRequired = formData =>
  _.get(
    'serviceInformation.reservesNationalGuardService.view:isTitle10Activated',
    formData,
    false,
  );

export const isInFuture = (errors, fieldData) => {
  const enteredDate = new Date(fieldData);
  if (enteredDate < Date.now()) {
    errors.addError('Expected separation date must be in the future');
  }
};

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
      `form_526_v1 / form_526_v2: capitalizeEachWord requires 'name' argument of type 'string' but got ${typeof name}`,
    );
  }

  return null;
};

export const hasForwardingAddress = formData =>
  _.get('view:hasForwardingAddress', formData, false);

export const forwardingCountryIsUSA = formData =>
  _.get('forwardingAddress.country', formData, '') === USA;

export function queryForFacilities(input = '') {
  // Only search if the input has a length >= 3, otherwise, return an empty array
  if (input.length < 3) {
    return Promise.resolve([]);
  }

  const url = appendQuery('/facilities/suggested', {
    type: ['health', 'dod_health'],
    name_part: input, // eslint-disable-line camelcase
  });

  return apiRequest(url)
    .then(response =>
      response.data.map(facility => ({
        id: facility.id,
        label: facility.attributes.name,
      })),
    )
    .catch(error => {
      Sentry.withScope(scope => {
        scope.setExtra('input', input);
        scope.setExtra('error', error);
        Sentry.captureMessage('Error querying for facilities');
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
export const sippableId = str => (str || 'blank').toLowerCase();

const createCheckboxSchema = (schema, disabilityName) => {
  const capitalizedDisabilityName =
    typeof disabilityName === 'string'
      ? capitalizeEachWord(disabilityName)
      : NULL_CONDITION_STRING;
  return _.set(
    // As an array like this to prevent periods in the name being interpreted as nested objects
    [sippableId(disabilityName)],
    { title: capitalizedDisabilityName, type: 'boolean' },
    schema,
  );
};

export const makeSchemaForNewDisabilities = createSelector(
  formData => formData.newDisabilities,
  (newDisabilities = []) => ({
    properties: newDisabilities
      .map(disability => disability.condition)
      .reduce(createCheckboxSchema, {}),
  }),
);

export const makeSchemaForRatedDisabilities = createSelector(
  formData => formData.ratedDisabilities,
  (ratedDisabilities = []) => ({
    properties: ratedDisabilities
      .filter(disabilityIsSelected)
      .map(disability => disability.name)
      .reduce(createCheckboxSchema, {}),
  }),
);

export const makeSchemaForAllDisabilities = createSelector(
  makeSchemaForNewDisabilities,
  makeSchemaForRatedDisabilities,
  (newDisabilitiesSchema, ratedDisabilitiesSchema) =>
    merge({}, newDisabilitiesSchema, ratedDisabilitiesSchema),
);

export const hasVAEvidence = formData =>
  _.get(DATA_PATHS.hasVAEvidence, formData, false);
export const hasOtherEvidence = formData =>
  _.get(DATA_PATHS.hasAdditionalDocuments, formData, false);
export const hasPrivateEvidence = formData =>
  _.get(DATA_PATHS.hasPrivateEvidence, formData, false);

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

/**
 * Returns the uiSchema for addresses that use the non-common address schema as found
 *  in the 526EZ-all-claims schema.
 * @param {string} addressPath - The path to the address in the formData
 * @param {string} [title] - Displayed as the card title in the card's header
 * @param {boolean} reviewCard - Whether to display the information in a ReviewCardField or not
 * @param {boolean} fieldsAreRequired - Whether the typical fields should be required or not
 * @returns {object} - UI schema for an address card's content
 */
export const addressUISchema = (
  addressPath,
  title,
  reviewCard,
  fieldsAreRequired = true,
) => {
  const updateStates = (formData, currentSchema, uiSchema, index) => {
    // Could use path (updateSchema callback param after index), but it points to `state`,
    //  so using `addressPath` is easier
    const currentCity = _.get(
      `${pathWithIndex(addressPath, index)}.city`,
      formData,
      '',
    )
      .trim()
      .toUpperCase();
    if (MILITARY_CITIES.includes(currentCity)) {
      return {
        enum: MILITARY_STATE_VALUES,
        enumNames: MILITARY_STATE_LABELS,
      };
    }

    return {
      enum: STATE_VALUES,
      enumNames: STATE_LABELS,
    };
  };

  return {
    'ui:order': [
      'country',
      'addressLine1',
      'addressLine2',
      'addressLine3',
      'city',
      'state',
      'zipCode',
    ],
    'ui:title': title,
    'ui:field': reviewCard && ReviewCardField,
    'ui:options': {
      viewComponent: AddressViewField,
    },
    country: {
      'ui:title': 'Country',
    },
    addressLine1: {
      'ui:title': 'Street address',
      'ui:errorMessages': {
        pattern: 'Please enter a valid street address',
        required: 'Please enter a street address',
      },
    },
    addressLine2: {
      'ui:title': 'Street address',
      'ui:errorMessages': {
        pattern: 'Please enter a valid street address',
      },
    },
    addressLine3: {
      'ui:title': 'Street address',
      'ui:errorMessages': {
        pattern: 'Please enter a valid street address',
      },
    },
    city: {
      'ui:title': 'City',
      'ui:validations': [
        {
          options: { addressPath },
          // pathWithIndex is called in validateMilitaryCity
          validator: validateMilitaryCity,
        },
      ],
      'ui:errorMessages': {
        pattern: 'Please enter a valid city',
        required: 'Please enter a city',
      },
    },
    state: {
      'ui:title': 'State',
      'ui:required': (formData, index) =>
        fieldsAreRequired &&
        _.get(`${pathWithIndex(addressPath, index)}.country`, formData, '') ===
          USA,
      'ui:options': {
        hideIf: (formData, index) =>
          _.get(
            `${pathWithIndex(addressPath, index)}.country`,
            formData,
            '',
          ) !== USA,
        updateSchema: updateStates,
      },
      'ui:validations': [
        {
          options: { addressPath },
          // pathWithIndex is called in validateMilitaryState
          validator: validateMilitaryState,
        },
      ],
      'ui:errorMessages': {
        pattern: 'Please enter a valid state',
        required: 'Please enter a state',
      },
    },
    zipCode: {
      'ui:title': 'Postal code',
      'ui:validations': [validateZIP],
      'ui:required': (formData, index) =>
        fieldsAreRequired &&
        _.get(`${pathWithIndex(addressPath, index)}.country`, formData, '') ===
          USA,
      'ui:errorMessages': {
        required: 'Please enter a postal code',
        pattern:
          'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
      },
      'ui:options': {
        widgetClassNames: 'va-input-medium-large',
        hideIf: (formData, index) =>
          _.get(
            `${pathWithIndex(addressPath, index)}.country`,
            formData,
            '',
          ) !== USA,
      },
    },
  };
};

const ptsdAddressOmitions = [
  'addressLine1',
  'addressLine2',
  'addressLine3',
  'postalCode',
  'zipCode',
];

/**
 * @param {string} addressPath - The path to the address in the formData
 */
export function incidentLocationUISchema(addressPath) {
  const addressUIConfig = omit(
    addressUISchema(addressPath, null, false, false),
    ptsdAddressOmitions,
  );
  return {
    ...addressUIConfig,
    state: {
      ...addressUIConfig.state,
      'ui:title': 'State/Province',
    },
    additionalDetails: {
      'ui:title':
        'Additional details (This could include an address, landmark, military installation, or other location.)',
      'ui:widget': 'textarea',
    },
    'ui:order': ['country', 'state', 'city', 'additionalDetails'],
  };
}

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

export const hasNewPtsdDisability = formData =>
  _.get('view:newDisabilities', formData, false) &&
  _.get('newDisabilities', formData, []).some(disability =>
    isDisabilityPtsd(disability.condition),
  );

export const needsToEnter781 = formData =>
  hasNewPtsdDisability(formData) &&
  (_.get('view:selectablePtsdTypes.view:combatPtsdType', formData, false) ||
    _.get('view:selectablePtsdTypes.view:nonCombatPtsdType', formData, false));

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

export const ancillaryFormUploadUi = (
  label,
  itemDescription,
  {
    attachmentId = '',
    widgetType = 'select',
    customClasses = '',
    isDisabled = false,
    addAnotherLabel = 'Add Another',
  } = {},
) =>
  fileUploadUI(label, {
    itemDescription,
    hideLabelText: !label,
    fileUploadUrl: `${environment.API_URL}/v0/upload_supporting_evidence`,
    addAnotherLabel,
    fileTypes: ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'txt'],
    maxSize: TWENTY_FIVE_MB,
    createPayload: file => {
      const payload = new FormData();
      payload.append('supporting_evidence_attachment[file_data]', file);

      return payload;
    },
    parseResponse: (response, file) => ({
      name: file.name,
      confirmationCode: response.data.attributes.guid,
      attachmentId,
    }),
    attachmentSchema: {
      'ui:title': 'Document type',
      'ui:disabled': isDisabled,
      'ui:widget': widgetType,
    },
    classNames: customClasses,
    attachmentName: false,
  });

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

export const getAttachmentsSchema = defaultAttachmentId => {
  const { attachments } = fullSchema.properties;
  return _.set(
    'items.properties.attachmentId.default',
    defaultAttachmentId,
    attachments,
  );
};

const isDateRange = ({ from, to }) => !!(from && to);

const parseDate = dateString => moment(dateString, 'YYYY-MM-DD');

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

  return insideDate.isBetween(from, to, 'days', inclusivity);
};

// This is in here instead of validations.js because it returns a jsx element
export const getPOWValidationMessage = servicePeriodDateRanges => (
  <span>
    The dates you enter must be within one of the service periods you entered.
    <ul>
      {servicePeriodDateRanges.map((range, index) => (
        <li key={index}>
          {moment(range.from).format('MMM DD, YYYY')} —{' '}
          {moment(range.to).format('MMM DD, YYYY')}
        </li>
      ))}
    </ul>
  </span>
);

const isClaimingIncrease = formData =>
  _.get('view:claimType.view:claimingIncrease', formData, false);
const isClaimingNew = formData =>
  _.get('view:claimType.view:claimingNew', formData, false);

export const increaseOnly = formData =>
  isClaimingIncrease(formData) && !isClaimingNew(formData);
export const newConditionsOnly = formData =>
  !isClaimingIncrease(formData) && isClaimingNew(formData);
export const newAndIncrease = formData =>
  isClaimingNew(formData) && isClaimingIncrease(formData);

// Shouldn't be possible, but just in case this requirement is lifted later...
export const noClaimTypeSelected = formData =>
  !isClaimingNew(formData) && !isClaimingIncrease(formData);

export const hasNewDisabilities = formData =>
  formData['view:newDisabilities'] === true;

/**
 * The base urls for each form
 * @readonly
 * @enum {String}
 */
export const urls = {
  v1: disability526Manifest.rootUrl,
  v2: DISABILITY_526_V2_ROOT_URL,
};

/**
 * Returns whether the formData is v1 or not.
 * This assumes that the `veteran` property of the formData will be present
 *  only in v1 after the form is saved. The prefillTransformer should
 *  remove this property from the v2 formData for this to work properly.
 */
const isV1App = (formData, isPrefill) => !isPrefill && formData.veteran;

/**
 * Returns the base url of whichever form the user needs to go to.
 *
 * @param {Object} formData - The saved form data
 * @param {Boolean} isPrefill - True if formData comes from pre-fill, false if it's a saved form
 * @return {String} - The base url of the right form to return to
 */
export const getFormUrl = (formData, isPrefill) =>
  isV1App(formData, isPrefill) ? urls.v1 : urls.v2;

/**
 * Navigates to the appropriate form (v1 or v2) based on the saved data.
 */
export const directToCorrectForm = ({
  formData,
  savedForms,
  returnUrl,
  formConfig,
  router,
}) => {
  // If we can find the form in the savedForms array, it's not pre-filled
  const isPrefill = !savedForms.find(form => form.form === formConfig.formId);
  const baseUrl = getFormUrl(formData, isPrefill);
  if (!isPrefill && !window.location.pathname.includes(baseUrl)) {
    // Redirect to the other app
    window.location.assign(`${baseUrl}/resume`);
  } else {
    router.push(returnUrl);
  }
};

export const claimingRated = formData =>
  formData.ratedDisabilities &&
  formData.ratedDisabilities.some(d => d['view:selected']);

// TODO: Rename this to avoid collision with `isClaimingNew` above
export const claimingNew = formData =>
  formData.newDisabilities && formData.newDisabilities.some(d => d.condition);

export const hasClaimedConditions = formData =>
  claimingNew(formData) || claimingRated(formData);

export const hasRatedDisabilities = formData =>
  formData.ratedDisabilities && formData.ratedDisabilities.length;

/**
 * Finds active service periods—those without end dates or end dates
 * in the future.
 */
export const activeServicePeriods = formData =>
  _.get('serviceInformation.servicePeriods', formData, []).filter(
    sp => !sp.dateRange.to || moment(sp.dateRange.to).isAfter(moment()),
  );

export const DISABILITY_SHARED_CONFIG = {
  orientation: {
    path: 'disabilities/orientation',
    // Only show the page if both (or potentially neither) options are chosen on the claim-type page
    depends: formData =>
      newAndIncrease(formData) || noClaimTypeSelected(formData),
  },
  ratedDisabilities: {
    path: 'disabilities/rated-disabilities',
    depends: formData =>
      hasRatedDisabilities(formData) && !newConditionsOnly(formData),
  },
  addDisabilities: {
    path: 'new-disabilities/add',
    depends: hasNewDisabilities,
  },
};
