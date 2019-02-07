import React from 'react';
import moment from 'moment';
import Raven from 'raven-js';
import appendQuery from 'append-query';
import { createSelector } from 'reselect';
import { omit } from 'lodash';
import recordEvent from '../../../platform/monitoring/record-event';
import { apiRequest } from '../../../platform/utilities/api';
import environment from '../../../platform/utilities/environment';
import _ from '../../../platform/utilities/data';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import fileUploadUI from 'us-forms-system/lib/js/definitions/file';
import { validateZIP } from './validations';

import {
  schema as addressSchema,
  uiSchema as addressUI,
} from '../../../platform/forms/definitions/address';

import {
  RESERVE_GUARD_TYPES,
  USA,
  DATA_PATHS,
  NINE_ELEVEN,
  HOMELESSNESS_TYPES,
  TWENTY_FIVE_MB,
  PTSD_MATCHES,
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

export const hasGuardOrReservePeriod = formData => {
  const serviceHistory = formData.servicePeriods;
  if (!serviceHistory || !Array.isArray(serviceHistory)) {
    return false;
  }

  return serviceHistory.reduce((isGuardReserve, { serviceBranch }) => {
    // For a new service period, service branch defaults to undefined
    if (!serviceBranch) {
      return false;
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
 * string is given as input, returns 'Unknown Condition' and logs to Sentry.
 * @param {string} name the lower-case name of a disability
 * @returns {string} the input name, but with all words capitalized
 */
export const capitalizeEachWord = name => {
  if (name && typeof name === 'string') {
    return name.replace(/\w+/g, capitalizeWord);
  }

  Raven.captureMessage(
    `form_526_v1 / form_526_v2: capitalizeEachWord requires 'name' argument of type 'string' but got ${typeof name}`,
  );
  return 'Unknown Condition';
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

  return apiRequest(
    url,
    {},
    response =>
      response.data.map(facility => ({
        id: facility.id,
        label: facility.attributes.name,
      })),
    error => {
      Raven.captureMessage('Error querying for facilities', { input, error });
      return [];
    },
  );
}

export const disabilityIsSelected = disability => disability['view:selected'];

/**
 * An updateSchema callback that adds boolean properties to the schema.
 * The property names are lowercased, while the title is title cased.
 */
export const addCheckboxPerDisability = (formData, pageSchema) => {
  const { ratedDisabilities, newDisabilities } = formData;
  // This shouldn't happen, but could happen if someone directly
  // opens the right page in the form with no SiP
  if (!ratedDisabilities && !newDisabilities) {
    return pageSchema;
  }
  const selectedRatedDisabilities = Array.isArray(ratedDisabilities)
    ? ratedDisabilities.filter(disabilityIsSelected)
    : [];

  const selectedNewDisabilities = Array.isArray(newDisabilities)
    ? newDisabilities
    : [];

  // We expect to get an array with conditions in it or no property
  // at all.
  const disabilitiesViews = selectedRatedDisabilities
    .concat(selectedNewDisabilities)
    .reduce((accum, curr) => {
      const disabilityName = curr.name || curr.condition || '';
      const capitalizedDisabilityName = capitalizeEachWord(disabilityName);
      return _.set(
        // downcase value for SIP consistency
        disabilityName.toLowerCase(),
        { title: capitalizedDisabilityName, type: 'boolean' },
        accum,
      );
    }, {});
  return {
    properties: disabilitiesViews,
  };
};

const formattedNewDisabilitiesSelector = createSelector(
  formData => formData.newDisabilities,
  (newDisabilities = []) =>
    newDisabilities.map(disability => capitalizeEachWord(disability.condition)),
);

export const addCheckboxPerNewDisability = createSelector(
  formattedNewDisabilitiesSelector,
  newDisabilities => ({
    properties: newDisabilities.reduce(
      (accum, disability) => _.set(disability, { type: 'boolean' }, accum),
      {},
    ),
  }),
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
 * Creates uiSchema and schema for address widget based on params
 * @param {array} addressOmitions
 * @param {array} order
 * @param {object} fieldLabels
 */
export function generateAddressSchemas(addressOmitions, order, fieldLabels) {
  const addressSchemaConfig = addressSchema(fullSchema);
  const addressUIConfig = omit(addressUI(' '), addressOmitions);

  const locationSchema = {
    addressUI: {
      ...addressUIConfig,
      'ui:order': order,
    },
    addressSchema: {
      ...addressSchemaConfig,
      properties: {
        ...omit(addressSchemaConfig.properties, addressOmitions),
      },
    },
  };

  if (!addressOmitions.includes('country')) {
    locationSchema.addressUI.country = {
      'ui:title': fieldLabels.country,
    };
  }

  if (!addressOmitions.includes('addressLine1')) {
    locationSchema.addressUI.addressLine1 = {
      'ui:title': fieldLabels.addressLine1,
    };
  }

  if (!addressOmitions.includes('addressLine2')) {
    locationSchema.addressUI.addressLine2 = {
      'ui:title': fieldLabels.addressLine2,
    };
  }

  if (!addressOmitions.includes('city')) {
    locationSchema.addressUI.city = {
      'ui:title': fieldLabels.city,
    };
  }

  if (!addressOmitions.includes('state')) {
    locationSchema.addressUI.state = {
      'ui:title': fieldLabels.state,
    };
  }

  if (!addressOmitions.includes('zipCode')) {
    locationSchema.addressUI.zipCode = {
      'ui:title': fieldLabels.zipCode,
      'ui:validations': [validateZIP],
      'ui:errorMessages': {
        pattern: 'Please enter a valid 5- or 9-digit ZIP code (dashes allowed)',
      },
    };
  }

  return locationSchema;
}

// Could be changed to use generateLocationSchemas
export function incidentLocationSchemas() {
  const addressOmitions = [
    'addressLine1',
    'addressLine2',
    'addressLine3',
    'postalCode',
    'zipCode',
  ];

  const addressSchemaConfig = addressSchema(fullSchema);
  const addressUIConfig = omit(addressUI(' '), addressOmitions);

  return {
    addressUI: {
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
    },
    addressSchema: {
      ...addressSchemaConfig,
      properties: {
        ...omit(addressSchemaConfig.properties, addressOmitions),
        additionalDetails: {
          type: 'string',
        },
      },
    },
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

  const loweredDisability = disability.toLowerCase();
  return PTSD_MATCHES.some(
    ptsdString =>
      ptsdString.includes(loweredDisability) ||
      loweredDisability.includes(ptsdString),
  );
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
    fileTypes: [
      'pdf',
      'jpg',
      'jpeg',
      'png',
      'gif',
      'bmp',
      'tif',
      'tiff',
      'txt',
    ],
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

/**
 * The base urls for each form
 * @readonly
 * @enum {String}
 */
const urls = {
  v1: '/disability-benefits/apply/form-526-disability-claim',
  v2: '/disability-benefits/apply/form-526-all-claims',
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

/**
 * Pushes an event to the Analytics dataLayer if the event doesn't already
 * exist there.
 * @param {object} event this will get pushed to `dataLayer`
 * @param {string} key the property in the event object to use when looking for
 *                     existing matches in the dataLayer
 */
export const recordEventOnce = (event, key) => {
  const alreadyRecorded =
    window.dataLayer &&
    !!window.dataLayer.find(item => item[key] === event[key]);

  if (!alreadyRecorded) {
    recordEvent(event);
  }
};
