import React from 'react';
import moment from 'moment';
import Raven from 'raven-js';
import appendQuery from 'append-query';
import { createSelector } from 'reselect';
import { omit } from 'lodash';
import { transformForSubmit } from 'us-forms-system/lib/js/helpers';
import { apiRequest } from '../../../platform/utilities/api';
import environment from '../../../platform/utilities/environment';
import _ from '../../../platform/utilities/data';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import removeDeeplyEmptyObjects from '../../../platform/utilities/data/removeDeeplyEmptyObjects';
import fileUploadUI from 'us-forms-system/lib/js/definitions/file';

import {
  schema as addressSchema,
  uiSchema as addressUI,
} from '../../../platform/forms/definitions/address';

import {
  RESERVE_GUARD_TYPES,
  SERVICE_CONNECTION_TYPES,
  USA,
  DATA_PATHS,
  NINE_ELEVEN,
  HOMELESSNESS_TYPES,
  TWENTY_FIVE_MB,
  causeTypes,
  specialIssueTypes,
  PTSD_INCIDENT_ITERATION,
  PTSD_CHANGE_LABELS,
  disabilityActionTypes,
} from './constants';
import cloneDeep from '../../../platform/utilities/data/cloneDeep';
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

// Only service-connected disabilities should be included in the form
export const filterServiceConnected = (disabilities = []) =>
  disabilities.filter(
    d => d.decisionCode === SERVICE_CONNECTION_TYPES.serviceConnected,
  );

// Add 'NONE' disabilityActionType to each rated disability because it's
// required in the schema
export const addNoneDisabilityActionType = (disabilities = []) =>
  disabilities.map(d =>
    _.set('disabilityActionType', disabilityActionTypes.NONE, d),
  );

export function transformMVPData(formData) {
  const newFormData = _.omit(
    ['veteran', 'servicePeriods', 'reservesNationalGuardService'],
    formData,
  );

  // Spread the properties in formData.veteran
  Object.keys(_.get('veteran', formData, {})).forEach(key => {
    newFormData[key] = formData.veteran[key];
  });

  // Nest servicePeriods and reservesNationalGuardService under serviceInformation
  //  without creating a serviceInformation property unnecessarily
  const { servicePeriods, reservesNationalGuardService } = formData;
  if (servicePeriods || reservesNationalGuardService) {
    newFormData.serviceInformation = {
      ..._.get('serviceInformation', newFormData, {}),
      servicePeriods,
      reservesNationalGuardService,
    };
  }

  return newFormData;
}

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

export function prefillTransformer(pages, formData, metadata) {
  const newFormData = transformMVPData(formData);
  const { disabilities } = newFormData;

  // SiP automatically removes empty properties from prefill
  if (disabilities) {
    newFormData.ratedDisabilities = addNoneDisabilityActionType(
      filterServiceConnected(disabilities),
    );

    delete newFormData.disabilities;
  }

  // Pre-fill hidden bank info for use in the PaymentView
  const bankAccount = {
    bankAccountType: newFormData.bankAccountType,
    bankAccountNumber: newFormData.bankAccountNumber,
    bankRoutingNumber: newFormData.bankRoutingNumber,
    bankName: newFormData.bankName,
  };
  newFormData['view:originalBankAccount'] = viewifyFields(bankAccount);

  // Let the payment info card start in review mode if we have pre-filled bank information
  if (
    Object.values(newFormData['view:originalBankAccount']).some(
      value => !!value,
    )
  ) {
    newFormData['view:bankAccount'] = {
      'view:hasPrefilledBank': true,
    };
  }

  // Remove bank fields since they're already in view:originalBankAccount
  delete newFormData.bankAccountType;
  delete newFormData.bankAccountNumber;
  delete newFormData.bankRoutingNumber;
  delete newFormData.bankName;

  return {
    metadata,
    formData: newFormData,
    pages,
  };
}

/**
 * Transforms the related disabilities object into an array of strings. The condition
 *  name only gets added to the list if the property value is truthy and is in the list
 *  of conditions claimed on the application.
 *
 * @param {Object} object - The object with dynamically generated property names
 * @param {Array<String>} claimedConditions - An array of lower-cased names of conditions claimed
 * @return {Array} - An array of the property names with truthy values
 *                   NOTE: This will return all lower-cased names
 */
export function transformRelatedDisabilities(object, claimedConditions) {
  return Object.keys(object)
    .filter(
      // The property name will be normal-cased in the object, but lower-cased in claimedConditions
      key => object[key] && claimedConditions.includes(key.toLowerCase()),
    )
    .map(key => key.toLowerCase());
}

/**
 * Cycles through the list of provider facilities and performs transformations on each property as needed
 * @param {array} providerFacilities array of objects being transformed
 * @returns {array} containing the new Provider Facility structure
 */
export function transformProviderFacilities(providerFacilities) {
  return providerFacilities.map(facility => ({
    ...facility,
    treatmentDateRange: [facility.treatmentDateRange],
  }));
}

/**
 * Concatenates incident location address object into location string. This will ignore null
 *  or undefined address fields
 * @param {Object} incidentLocation location address with city, state, country, and additional details
 * @returns {String} incident location string
 */
export function concatIncidentLocationString(incidentLocation) {
  return [
    incidentLocation.city,
    incidentLocation.state,
    incidentLocation.country,
    incidentLocation.additionalDetails,
  ]
    .filter(locationField => locationField)
    .join(', ');
}

/**
 * Returns an array of the maximum set of PTSD incident form data field names
 */
export function getFlatIncidentKeys() {
  const incidentKeys = [];

  for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
    incidentKeys.push(`incident${i}`);
  }
  for (let i = 0; i < PTSD_INCIDENT_ITERATION; i++) {
    incidentKeys.push(`secondaryIncident${i}`);
  }

  return incidentKeys;
}

export function getPtsdChangeText(changeFields = {}) {
  return Object.keys(changeFields)
    .filter(
      key =>
        key !== 'other' &&
        key !== 'otherExplanation' &&
        PTSD_CHANGE_LABELS[key],
    )
    .map(key => PTSD_CHANGE_LABELS[key]);
}

/**
 * This is mostly copied from us-forms' own stringifyFormReplacer, but with
 * the incomplete / empty address check removed, since we don't need this
 * for any of the 3 addresses (mailing, forwarding, treatment facility) in our
 * form. Leaving it in breaks treatment facility addresses because by design
 * they don't have street / line 1 addresses, so would get incorrectly filtered
 * out. Trivia: this check is also gone in the latest us-forms replacer.
 */
export function customReplacer(key, value) {
  // clean up empty objects, which we have no reason to send
  if (typeof value === 'object') {
    const fields = Object.keys(value);
    if (
      fields.length === 0 ||
      fields.every(field => value[field] === undefined)
    ) {
      return undefined;
    }

    // autosuggest widgets save value and label info, but we should just return the value
    if (value.widget === 'autosuggest') {
      return value.id;
    }

    // Exclude file data
    if (value.confirmationCode && value.file) {
      return _.omit('file', value);
    }
  }

  // Clean up empty objects in arrays
  if (Array.isArray(value)) {
    const newValues = value.filter(v => !!customReplacer(key, v));
    // If every item in the array is cleared, remove the whole array
    return newValues.length > 0 ? newValues : undefined;
  }

  return value;
}

export const disabilityIsSelected = disability => disability['view:selected'];

const setActionType = disability =>
  disabilityIsSelected(disability)
    ? _.set('disabilityActionType', disabilityActionTypes.INCREASE, disability)
    : _.set('disabilityActionType', disabilityActionTypes.NONE, disability);

/**
 * Sets disabilityActionType for rated disabilities to either INCREASE (for
 * selected disabilities) or NONE (for unselected disabilities)
 * @param {object} formData
 * @returns {object} new object with either form data with disabilityActionType
 * set for each rated disability, or cloned formData when no rated disabilities
 * exist
 */
export const setActionTypes = formData => {
  const { ratedDisabilities } = formData;

  if (ratedDisabilities) {
    return _.set(
      'ratedDisabilities',
      ratedDisabilities.map(setActionType),
      formData,
    );
  }

  return cloneDeep(formData);
};

export function transform(formConfig, form) {
  // Remove rated disabilities that weren't selected
  let clonedData = setActionTypes(form.data);

  // Need to set up claimedConditions before we transformForSubmit because we
  // depend on the `view:selected` property here
  const claimedConditions = clonedData.ratedDisabilities
    ? clonedData.ratedDisabilities
        .filter(disabilityIsSelected)
        .map(d => d.name.toLowerCase())
    : [];

  // Have to do this first or it messes up the results from transformRelatedDisabilities for some reason.
  // The transformForSubmit's JSON.stringify transformer doesn't remove deeply empty objects, so we call
  //  it here to remove reservesNationalGuardService if it's deeply empty.
  clonedData = removeDeeplyEmptyObjects(
    JSON.parse(
      transformForSubmit(
        formConfig,
        {
          ...form,
          data: clonedData,
        },
        customReplacer,
      ),
    ),
  );

  if (clonedData.newDisabilities) {
    // Add new disabilities to claimed conditions list
    clonedData.newDisabilities.forEach(disability =>
      claimedConditions.push(disability.condition.toLowerCase()),
    );

    if (clonedData.powDisabilities) {
      // Add POW specialIssue to new conditions
      const powDisabilities = transformRelatedDisabilities(
        clonedData.powDisabilities,
        claimedConditions,
      ).map(name => name.toLowerCase());
      clonedData.newDisabilities = clonedData.newDisabilities.map(d => {
        if (powDisabilities.includes(d.condition.toLowerCase())) {
          const newSpecialIssues = (d.specialIssues || []).slice();
          newSpecialIssues.push(specialIssueTypes.POW);
          return _.set('specialIssues', newSpecialIssues, d);
        }
        return d;
      });

      delete clonedData.powDisabilities;
    }

    // Add 'cause' of 'NEW' to new ptsd disabilities since form does not ask
    const withPtsdCause = clonedData.newDisabilities.map(
      disability =>
        disability.condition.toLowerCase().includes('ptsd')
          ? _.set('cause', causeTypes.NEW, disability)
          : disability,
    );

    // Split newDisabilities into primary and secondary arrays for backend
    const newPrimaryDisabilities = withPtsdCause.filter(
      disability => disability.cause !== causeTypes.SECONDARY,
    );
    const newSecondaryDisabilities = withPtsdCause.filter(
      disability => disability.cause === causeTypes.SECONDARY,
    );

    if (newPrimaryDisabilities.length) {
      clonedData.newPrimaryDisabilities = newPrimaryDisabilities;
    }
    if (newSecondaryDisabilities.length) {
      clonedData.newSecondaryDisabilities = newSecondaryDisabilities;
    }
    delete clonedData.newDisabilities;
  }

  // Transform the related disabilities lists into an array of strings
  if (clonedData.vaTreatmentFacilities) {
    const newVAFacilities = clonedData.vaTreatmentFacilities.map(facility => {
      // Transform the related disabilities lists into an array of strings
      const newFacility = _.set(
        'treatedDisabilityNames',
        transformRelatedDisabilities(
          facility.treatedDisabilityNames,
          claimedConditions,
        ),
        facility,
      );

      // If the day is missing, set it to the last day of the month because EVSS requires a day
      const [year, month, day] = _.get(
        'treatmentDateRange.to',
        newFacility,
        '',
      ).split('-');
      if (day && day === 'XX') {
        newFacility.treatmentDateRange.to = moment(`${year}-${month}`)
          .endOf('month')
          .format('YYYY-MM-DD');
      }

      return newFacility;
    });
    clonedData.vaTreatmentFacilities = newVAFacilities;
  }

  if (clonedData.providerFacility) {
    clonedData.form4142 = {
      ...(clonedData.limitedConsent && {
        limitedConsent: clonedData.limitedConsent,
      }),
      ...(clonedData.providerFacility && {
        providerFacility: transformProviderFacilities(
          clonedData.providerFacility,
        ),
      }),
    };

    delete clonedData.limitedConsent;
    delete clonedData.providerFacility;
  }

  const incidentKeys = getFlatIncidentKeys();

  const incidents = incidentKeys
    .filter(incidentKey => clonedData[incidentKey])
    .map(incidentKey => ({
      ...clonedData[incidentKey],
      personalAssault: incidentKey.includes('secondary'),
      incidentLocation: concatIncidentLocationString(
        clonedData[incidentKey].incidentLocation,
      ),
    }));

  incidentKeys.forEach(incidentKey => {
    delete clonedData[incidentKey];
  });

  if (incidents.length > 0) {
    clonedData.form0781 = {
      incidents,
      remarks: clonedData.additionalRemarks781,
      additionalIncidentText: clonedData.additionalIncidentText,
      additionalSecondaryIncidentText:
        clonedData.additionalSecondaryIncidentText,
      otherInformation: [
        ...getPtsdChangeText(clonedData.physicalChanges),
        _.get('physicalChanges.otherExplanation', clonedData, ''),
        ...getPtsdChangeText(clonedData.socialBehaviorChanges),
        _.get('socialBehaviorChanges.otherExplanation', clonedData, ''),
        ...getPtsdChangeText(clonedData.mentalChanges),
        _.get('mentalChanges.otherExplanation', clonedData, ''),
        ...getPtsdChangeText(clonedData.workBehaviorChanges),
        _.get('workBehaviorChanges.otherExplanation', clonedData, ''),
        _.get('additionalChanges', clonedData, ''),
      ].filter(info => info.length > 0),
    };

    delete clonedData.physicalChanges;
    delete clonedData.socialBehaviorChanges;
    delete clonedData.mentalChanges;
    delete clonedData.workBehaviorChanges;
    delete clonedData.additionalChanges;
    delete clonedData.additionalRemarks781;
    delete clonedData.additionalIncidentText;
    delete clonedData.additionalSecondaryIncidentText;
  }

  return JSON.stringify({ form526: clonedData });
}

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

export const addCheckboxPerDisability = (form, pageSchema) => {
  const { ratedDisabilities, newDisabilities } = form;
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

  // TODO: We might be able to clean this up once we know how EVSS
  // We expect to get an array with conditions in it or no property
  // at all.
  const disabilitiesViews = selectedRatedDisabilities
    .concat(selectedNewDisabilities)
    .reduce((accum, curr) => {
      const disabilityName = curr.name || curr.condition;
      const capitalizedDisabilityName = capitalizeEachWord(disabilityName);
      return _.set(capitalizedDisabilityName, { type: 'boolean' }, accum);
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

export const needsToEnter781 = formData =>
  _.get('view:selectablePtsdTypes.view:combatPtsdType', formData, false) ||
  _.get('view:selectablePtsdTypes.view:nonCombatPtsdType', formData, false);

export const needsToEnter781a = formData =>
  _.get('view:selectablePtsdTypes.view:mstPtsdType', formData, false) ||
  _.get('view:selectablePtsdTypes.view:assaultPtsdType', formData, false);

export const isUploading781Form = formData =>
  _.get('view:upload781Choice', formData, '') === 'upload';

export const isUploading781aForm = formData =>
  _.get('view:upload781aChoice', formData, '') === 'upload';

export const isUploading781aSupportingDocuments = index => formData =>
  _.get(`view:uploadChoice${index}`, formData, false);

export const isAnswering781Questions = index => formData =>
  _.get('view:upload781Choice', formData, '') === 'answerQuestions' &&
  (index === 0 ||
    _.get(`view:enterAdditionalEvents${index - 1}`, formData, false)) &&
  needsToEnter781(formData);

export const isAnswering781aQuestions = index => formData =>
  _.get('view:upload781aChoice', formData, '') === 'answerQuestions' &&
  (index === 0 ||
    _.get(
      `view:enterAdditionalSecondaryEvents${index - 1}`,
      formData,
      false,
    )) &&
  needsToEnter781a(formData);

export const isAddingIndividuals = index => formData =>
  isAnswering781Questions(index)(formData) &&
  _.get(`view:individualsInvolved${index}`, formData, false);

export const getHomelessOrAtRisk = formData => {
  const homelessStatus = _.get('homelessOrAtRisk', formData, '');
  return (
    homelessStatus === HOMELESSNESS_TYPES.homeless ||
    homelessStatus === HOMELESSNESS_TYPES.atRisk
  );
};

export const isNotUploadingPrivateMedical = formData =>
  _.get(DATA_PATHS.hasPrivateRecordsToUpload, formData) === false;

export const showPtsdCombatConclusion = form =>
  _.get('view:selectablePtsdTypes.view:combatPtsdType', form, false) ||
  _.get('view:selectablePtsdTypes.view:nonCombatPtsdType', form, false);

export const showPtsdAssaultConclusion = form =>
  _.get('view:selectablePtsdTypes.view:mstPtsdType', form, false) ||
  _.get('view:selectablePtsdTypes.view:assaultPtsdType', form, false);

export const needsToEnterUnemployability = formData =>
  _.get('view:unemployable', formData, false);

export const needsToAnswerUnemployability = formData =>
  needsToEnterUnemployability(formData) &&
  _.get('view:unemployabilityUploadChoice', formData, '') === 'answerQuestions';

export const hasDoctorsCare = formData =>
  needsToAnswerUnemployability(formData) &&
  _.get('view:medicalCareType.view:doctorsCare', formData, false);

export const hasHospitalCare = formData =>
  needsToAnswerUnemployability(formData) &&
  _.get('view:medicalCareType.view:hospitalized', formData, false);

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
