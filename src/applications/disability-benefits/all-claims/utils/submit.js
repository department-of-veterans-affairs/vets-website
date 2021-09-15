import _ from 'platform/utilities/data';
import {
  PTSD_INCIDENT_ITERATION,
  PTSD_CHANGE_LABELS,
  disabilityActionTypes,
} from '../constants';

import {
  disabilityIsSelected,
  hasGuardOrReservePeriod,
  sippableId,
} from '../utils';

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
 * Returns an array of disabilities pulled from ratedDisabilities, newDisabilities, newPrimaryDisabilities and newSecondaryDisabilities
 * @param {object} formData
 */
export function getDisabilities(
  formData,
  includeDisabilityActionTypeNone = true,
) {
  // Assumes we have only selected conditions at this point
  const claimedConditions = (formData.ratedDisabilities || []).filter(
    ratedDisability =>
      includeDisabilityActionTypeNone ||
      ratedDisability.disabilityActionType !== disabilityActionTypes.NONE,
  );

  // Depending on where this is called in the transformation flow, we have to use different key names.
  // This assumes newDisabilities is removed after it's split out into its primary and secondary counterparts.
  [
    'newDisabilities',
    'newPrimaryDisabilities',
    'newSecondaryDisabilities',
  ].forEach(key => {
    if (formData[key]) {
      // Add new disabilities to claimed conditions list
      formData[key].forEach(disability => claimedConditions.push(disability));
    }
  });
  return claimedConditions;
}

export function getDisabilityName(disability) {
  const name = disability.name ? disability.name : disability.condition;
  return name && name.trim();
}

export function getClaimedConditionNames(
  formData,
  includeDisabilityActionTypeNone = true,
) {
  return getDisabilities(formData, includeDisabilityActionTypeNone).map(
    disability => getDisabilityName(disability),
  );
}

export const setActionType = disability =>
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

  return _.cloneDeep(formData);
};

/**
 * Transforms the related disabilities object into an array of strings. The condition
 *  name only gets added to the list if the property value is truthy and is in the list
 *  of conditions claimed on the application.
 *
 * @param {Object} conditionContainer - The object with dynamically generated property names
 *                                      For example, treatedDisabilityNames.
 * @param {Array} claimedConditions - An array containing the names of conditions claimed,
 *                                     both rated or new.
 * @return {Array} - An array of the originally-cased property names with truthy values.
 *                   "Originally-cased" = the case of the name in the disabilities list.
 */
export function transformRelatedDisabilities(
  conditionContainer,
  claimedConditions,
) {
  const findCondition = (list, name = '') =>
    list.find(
      // name should already be lower-case, but just in case...no pun intended
      claimedName => sippableId(claimedName) === name.toLowerCase(),
    );

  return (
    Object.keys(conditionContainer)
      // The check box is checked
      .filter(name => conditionContainer[name])
      // It's in the list of claimed conditions
      .filter(name => findCondition(claimedConditions, name))
      // Return the name of the actual claimed condition (with the original casing)
      .map(name => findCondition(claimedConditions, name))
  );
}

export const removeExtraData = formData => {
  // EVSS no longer accepts some keys
  const ratingKeysToRemove = [
    'ratingDecisionId',
    'decisionCode',
    'decisionText',
    'ratingPercentage',
  ];
  const clonedData = _.cloneDeep(formData);
  const disabilities = clonedData.ratedDisabilities;
  if (disabilities?.length) {
    clonedData.ratedDisabilities = disabilities.map(disability =>
      Object.keys(disability).reduce((acc, key) => {
        if (!ratingKeysToRemove.includes(key)) {
          acc[key] = disability[key];
        }
        return acc;
      }, {}),
    );
  }
  return clonedData;
};

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

export function filterServicePeriods(formData) {
  const { serviceInformation } = formData;
  if (!serviceInformation || hasGuardOrReservePeriod(serviceInformation)) {
    return formData;
  }
  // remove `reservesNationalGuardService` since no associated
  // Reserve or National guard service periods have been provided
  // see https://github.com/department-of-veterans-affairs/va.gov-team/issues/6797
  const clonedData = _.cloneDeep(formData);
  delete clonedData.serviceInformation.reservesNationalGuardService;
  return clonedData;
}

// Transform the related disabilities lists into an array of strings
export const stringifyRelatedDisabilities = formData => {
  if (!formData.vaTreatmentFacilities) {
    return formData;
  }
  const clonedData = _.cloneDeep(formData);
  const newVAFacilities = clonedData.vaTreatmentFacilities.map(facility =>
    // Transform the related disabilities lists into an array of strings
    _.set(
      'treatedDisabilityNames',
      transformRelatedDisabilities(
        facility.treatedDisabilityNames,
        getClaimedConditionNames(formData, false),
      ),
      facility,
    ),
  );
  clonedData.vaTreatmentFacilities = newVAFacilities;
  return clonedData;
};

export const cleanUpPersonsInvolved = incident => {
  // We don't want to require any PTSD entries, but EVSS is rejecting any
  // personsInvolved that don't have a "injuryDeath" type set. So we're
  // setting blank entries to "other" and adding a generic other description
  // see https://github.com/department-of-veterans-affairs/va.gov-team/issues/21422
  const personsInvolved = incident.personsInvolved?.map(
    person =>
      person.injuryDeath
        ? person
        : {
            ...person,
            injuryDeath: 'other',
            injuryDeathOther: person.injuryDeathOther || 'Entry left blank',
          },
  );
  return {
    ...incident,
    personsInvolved,
  };
};

// Remove extra data that may be included
// see https://github.com/department-of-veterans-affairs/va.gov-team/issues/19423
export const cleanUpMailingAddress = formData => {
  const validKeys = [
    'country',
    'addressLine1',
    'addressLine2',
    'addressLine3',
    'city',
    'state',
    'zipCode',
  ];
  const mailingAddress = Object.entries(formData.mailingAddress).reduce(
    (address, [key, value]) => {
      if (value && validKeys.includes(key)) {
        return {
          ...address,
          [key]: value,
        };
      }
      return address;
    },
    {},
  );
  return { ...formData, mailingAddress };
};
