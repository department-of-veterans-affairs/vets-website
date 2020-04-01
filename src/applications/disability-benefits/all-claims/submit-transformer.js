import _ from '../../../platform/utilities/data';

import {
  transformForSubmit,
  filterViewFields,
} from 'platform/forms-system/src/js/helpers';
import removeDeeplyEmptyObjects from '../../../platform/utilities/data/removeDeeplyEmptyObjects';

import {
  causeTypes,
  specialIssueTypes,
  PTSD_INCIDENT_ITERATION,
  PTSD_CHANGE_LABELS,
  ATTACHMENT_KEYS,
  disabilityActionTypes,
} from './constants';

import { disabilityIsSelected, hasGuardOrReservePeriod } from './utils';

import disabilityLabels from './content/disabilityLabels';

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
function getDisabilities(formData, includeDisabilityActionTypeNone = true) {
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

function getDisabilityName(disability) {
  const name = disability.name ? disability.name : disability.condition;
  return name && name.trim();
}

function getClaimedConditionNames(
  formData,
  includeDisabilityActionTypeNone = true,
) {
  return getDisabilities(formData, includeDisabilityActionTypeNone).map(
    disability => getDisabilityName(disability),
  );
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
  const findCondition = (list, name) =>
    list.find(
      // name should already be lower-case, but just in case...no pun intended
      claimedName => claimedName.toLowerCase() === name.toLowerCase(),
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

export function transform(formConfig, form) {
  // Grab ratedDisabilities before they're deleted in case the page is inactive
  // We need to send all of these to vets-api even if the veteran doesn't apply
  // for an increase on any of them
  const { ratedDisabilities } = form.data;
  const savedRatedDisabilities = ratedDisabilities
    ? _.cloneDeep(ratedDisabilities)
    : undefined;

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

  const addBackRatedDisabilities = formData =>
    savedRatedDisabilities
      ? _.set('ratedDisabilities', savedRatedDisabilities, formData)
      : formData;

  const filterRatedViewFields = formData => filterViewFields(formData);

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
        if (powDisabilities.includes(d.condition?.toLowerCase())) {
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
              disability.condition?.toLowerCase().includes('ptsd')
                ? _.set('cause', causeTypes.NEW, disability)
                : disability,
          ),
          formData,
        )
      : formData;

  // new disabilities that match a name on our mapped list need their
  // respective classification code added
  const addClassificationCodeToNewDisabilities = formData => {
    const { newDisabilities } = formData;
    if (!newDisabilities) {
      return formData;
    }

    const flippedDisabilityLabels = {};
    Object.entries(disabilityLabels).forEach(([code, description]) => {
      flippedDisabilityLabels[description?.toLowerCase()] = code;
    });

    const newDisabilitiesWithClassificationCodes = newDisabilities.map(
      disability => {
        const { condition } = disability;
        if (!condition) {
          return disability;
        }
        const loweredDisabilityName = condition?.toLowerCase();
        return flippedDisabilityLabels[loweredDisabilityName]
          ? _.set(
              'classificationCode',
              flippedDisabilityLabels[loweredDisabilityName],
              disability,
            )
          : disability;
      },
    );

    return _.set(
      'newDisabilities',
      newDisabilitiesWithClassificationCodes,
      formData,
    );
  };

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

  // transform secondary disabilities into primary, with description appended
  const transformSecondaryDisabilities = formData => {
    if (!formData.newSecondaryDisabilities) {
      return formData;
    }

    const clonedData = _.cloneDeep(formData);

    const transformedSecondaries = clonedData.newSecondaryDisabilities.map(
      sd => {
        // prepend caused by condition to primary description
        const descString = [
          'Secondary to ',
          sd.causedByDisability,
          '\n',
          sd.causedByDisabilityDescription,
        ].join('');

        return {
          condition: sd.condition,
          cause: causeTypes.NEW,
          classificationCode: sd.classificationCode,
          // truncate description to 400 characters
          primaryDescription: descString.substring(0, 400),
        };
      },
    );

    clonedData.newPrimaryDisabilities = (
      clonedData.newPrimaryDisabilities || []
    ).concat(transformedSecondaries);

    delete clonedData.newSecondaryDisabilities;
    return clonedData;
  };

  // Transform the related disabilities lists into an array of strings
  const stringifyRelatedDisabilities = formData => {
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

  const transformSeparationPayDate = formData => {
    if (!formData.separationPayDate) {
      return formData;
    }

    // Format separationPayDate as 'YYYY-MM-DD'
    return _.set(
      'separationPayDate',
      `${formData.separationPayDate}-XX-XX`,
      formData,
    );
  };

  /**
   * We want veterans to be able to type in all chars in the homelessness POC
   * name field, but we only want to send allowed characters (per schema) to
   * vets-api
   * @param {object} formData
   * @returns {object} either formData, or if homelessness contact name exists,
   * a copy of formData with the homelessness POC name sanitized
   */
  const sanitizeHomelessnessContact = formData => {
    const { homelessnessContact } = formData;
    if (!homelessnessContact || !homelessnessContact.name) {
      return formData;
    }

    // When name is present, phoneNumber is required and vice-versa
    // But neither field is required unless the other is present
    const sanitizedHomelessnessContact = {
      name: homelessnessContact.name
        .replace(/[^a-zA-Z0-9-/' ]/g, ' ')
        .trim()
        .replace(/\s{2,}/g, ' '),
      phoneNumber: homelessnessContact.phoneNumber,
    };

    return _.set('homelessnessContact', sanitizedHomelessnessContact, formData);
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

  const addForm8940 = formData => {
    const clonedData = _.cloneDeep(formData);
    const { unemployability } = clonedData;

    if (unemployability) {
      const disabilities = getDisabilities(formData);

      clonedData.form8940 = {
        unemployability: {
          ...unemployability,
          disabilityPreventingEmployment: disabilities
            .filter(disability => disability.unemployabilityDisability)
            .map(disability => getDisabilityName(disability))
            .join(),
          underDoctorHopitalCarePast12M:
            unemployability.underDoctorsCare || unemployability.hospitalized,
          mostEarningsInAYear: (
            unemployability.mostEarningsInAYear || ''
          ).toString(),
          disabilityPreventMilitaryDuties:
            unemployability.disabilityPreventMilitaryDuties === 'yes',
        },
      };

      delete clonedData.form8940.unemployability.underDoctorsCare;
      delete clonedData.form8940.unemployability.hospitalized;
      delete clonedData.unemployability;
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
    filterEmptyObjects,
    addBackRatedDisabilities, // Must run after filterEmptyObjects
    setActionTypes, // Must run after addBackRatedDisabilities
    filterRatedViewFields, // Must be run after setActionTypes
    filterServicePeriods,
    addPOWSpecialIssues,
    addPTSDCause,
    addClassificationCodeToNewDisabilities,
    splitNewDisabilities,
    transformSecondaryDisabilities,
    stringifyRelatedDisabilities,
    transformSeparationPayDate,
    sanitizeHomelessnessContact,
    addForm4142,
    addForm0781,
    addForm8940,
    addFileAttachmments,
  ].reduce(
    (formData, transformer) => transformer(formData),
    _.cloneDeep(form.data),
  );

  return JSON.stringify({ form526: transformedData });
}
