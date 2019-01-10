import moment from 'moment';

import _ from '../../../platform/utilities/data';
import { transformForSubmit } from 'us-forms-system/lib/js/helpers';
import removeDeeplyEmptyObjects from '../../../platform/utilities/data/removeDeeplyEmptyObjects';

import {
  causeTypes,
  specialIssueTypes,
  PTSD_INCIDENT_ITERATION,
  PTSD_CHANGE_LABELS,
  ATTACHMENT_KEYS,
  disabilityActionTypes,
} from './constants';

import { disabilityIsSelected } from './utils';

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

function getClaimedConditionNames(formData) {
  // Assumes we have only selected conditions at this point
  // TODO: Filter by disabilityIsSelected
  const claimedConditions = formData.ratedDisabilities
    ? formData.ratedDisabilities.map(d => d.name.toLowerCase())
    : [];

  // Depending on where this is called in the transformation flow, we have to use different key names.
  // This assumes newDisabilities is removed after it's split out into its primary and secondary counterparts.
  [
    'newDisabilities',
    'newPrimaryDisabilities',
    'newSecondaryDisabilities',
  ].forEach(key => {
    if (formData[key]) {
      // Add new disabilities to claimed conditions list
      formData[key].forEach(disability =>
        claimedConditions.push(disability.condition.toLowerCase()),
      );
    }
  });
  return claimedConditions;
}

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

  return _.cloneDeep(formData);
};

/**
 * Transforms the related disabilities object into an array of strings. The condition
 *  name only gets added to the list if the property value is truthy and is in the list
 *  of conditions claimed on the application.
 *
 * @param {Object} object - The object with dynamically generated property names
 * @param {Object} formData - The whole form data; used to get claimed condition names
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

export function transform(formConfig, form) {
  // Define the transformations
  const filterEmptyObjects = formData =>
    removeDeeplyEmptyObjects(
      JSON.parse(
        transformForSubmit(
          formConfig,
          { ...form, data: formData },
          customReplacer,
        ),
      ),
    );

  const addPOWSpecialIssues = formData => {
    if (!formData.newDisabilities) {
      return formData;
    }
    const clonedData = _.cloneDeep(formData);
    if (clonedData.powDisabilities) {
      // Add POW specialIssue to new conditions
      const powDisabilities = transformRelatedDisabilities(
        clonedData.powDisabilities,
        getClaimedConditionNames(formData),
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
    return clonedData;
  };

  // Add 'cause' of 'NEW' to new ptsd disabilities since form does not ask
  const addPTSDCause = formData =>
    formData.newDisabilities
      ? _.set(
          'newDisabilities',
          formData.newDisabilities.map(
            disability =>
              disability.condition.toLowerCase().includes('ptsd')
                ? _.set('cause', causeTypes.NEW, disability)
                : disability,
          ),
          formData,
        )
      : formData;

  // newDisabilities -> newPrimaryDisabilities & newSecondaryDisabilities
  const splitNewDisabilities = formData => {
    if (!formData.newDisabilities) {
      return formData;
    }
    const clonedData = _.cloneDeep(formData);
    // Split newDisabilities into primary and secondary arrays for backend
    const newPrimaryDisabilities = clonedData.newDisabilities.filter(
      disability => disability.cause !== causeTypes.SECONDARY,
    );
    const newSecondaryDisabilities = clonedData.newDisabilities.filter(
      disability => disability.cause === causeTypes.SECONDARY,
    );
    if (newPrimaryDisabilities.length) {
      clonedData.newPrimaryDisabilities = newPrimaryDisabilities;
    }
    if (newSecondaryDisabilities.length) {
      clonedData.newSecondaryDisabilities = newSecondaryDisabilities;
    }
    delete clonedData.newDisabilities;
    return clonedData;
  };

  // Transform the related disabilities lists into an array of strings
  const stringifyRelatedDisabilities = formData => {
    if (!formData.vaTreatmentFacilities) {
      return formData;
    }
    const clonedData = _.cloneDeep(formData);
    const newVAFacilities = clonedData.vaTreatmentFacilities.map(facility => {
      // Transform the related disabilities lists into an array of strings
      const newFacility = _.set(
        'treatedDisabilityNames',
        transformRelatedDisabilities(
          facility.treatedDisabilityNames,
          getClaimedConditionNames(formData),
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
    return clonedData;
  };

  const addForm4142 = formData => {
    if (!formData.providerFacility) {
      return formData;
    }
    const clonedData = _.cloneDeep(formData);
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
    return clonedData;
  };

  const addForm0781 = formData => {
    const clonedData = _.cloneDeep(formData);
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
    return clonedData;
  };
  // Flatten all attachment pages into attachments ARRAY
  const addFileAttachmments = formData => {
    const clonedData = _.cloneDeep(formData);
    let attachments = [];

    ATTACHMENT_KEYS.forEach(key => {
      const documentArr = _.get(key, clonedData, []);
      attachments = [...attachments, ...documentArr];
      delete clonedData[key];
    });
    return { ...clonedData, ...(attachments.length && { attachments }) };
  };
  // End transformation definitions

  // Apply the transformations
  const transformedData = [
    setActionTypes,
    filterEmptyObjects,
    addPOWSpecialIssues,
    addPTSDCause,
    splitNewDisabilities,
    stringifyRelatedDisabilities,
    addForm4142,
    addForm0781,
    addFileAttachmments,
  ].reduce((formData, transformer) => transformer(formData), form.data);

  return JSON.stringify({ form526: transformedData });
}
