import _ from 'platform/utilities/data';
import {
  ATTACHMENT_KEYS,
  causeTypes,
  disabilityActionTypes,
  NEW_CONDITION_OPTION,
  PTSD_INCIDENT_ITERATION,
  PTSD_CHANGE_LABELS,
} from '../constants';

import {
  isDisabilityPtsd,
  disabilityIsSelected,
  hasGuardOrReservePeriod,
  sippableId,
} from './index';

import { migrateBranches } from './serviceBranches';

import { ptsdBypassDescription } from '../content/ptsdBypassContent';

import { form0781WorkflowChoices } from '../content/form0781/workflowChoices';

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

const norm = str => (str || '').trim().toLowerCase();

const collectSelectedNamesFromNewDisabilities = formData => {
  const picked = new Set();
  const list = formData?.newDisabilities || [];
  for (const newDisability of list) {
    // For "increase on rated condition", UI stores: { ratedDisability: '<name>' }
    const name = newDisability?.ratedDisability || null;

    // Ignore "new condition" sentinel and empties
    if (name && name !== NEW_CONDITION_OPTION) {
      picked.add(norm(name));
    }
  }
  return picked;
};

/**
 * Sets disabilityActionType for rated disabilities to either INCREASE (for
 * selected disabilities) or NONE (for unselected disabilities)
 * @param {object} formData
 * @returns {object} new object with either form data with disabilityActionType
 * set for each rated disability, or cloned formData when no rated disabilities
 * exist
 */
export const setActionTypes = formData => {
  const rated = formData?.ratedDisabilities || [];
  if (!rated.length) {
    return _.cloneDeep(formData);
  }

  const selectedNames = collectSelectedNamesFromNewDisabilities(formData);
  const useFallback = selectedNames.size === 0;

  const mapped = rated.map(data => {
    let candidate;

    if (!useFallback) {
      if (selectedNames.has(norm(data.name))) {
        candidate = { ...data, 'view:selected': true };
      } else {
        candidate = { ...data, 'view:selected': undefined };
      }
    } else {
      candidate = data;
    }

    return setActionType(candidate);
  });

  return _.set('ratedDisabilities', mapped, formData);
};

/* At time of submission, the newDisabilities object also contains
rated disabilities. These rated disabilities that have been selected
for increase must be removed from the newDisabilities object and
added to the ratedDisabilities object. This transformation is needed
in order for the form to successfully submit.
*/
const isRatedDisabilityCondition = v => norm(v) === 'rated disability';

export const normalizeIncreases = formData => {
  if (!formData?.disabilityCompNewConditionsWorkflow) return formData;

  const rated = Array.isArray(formData?.ratedDisabilities)
    ? formData.ratedDisabilities.map(r => ({ ...r }))
    : [];

  const indexByName = new Map(rated.map((r, i) => [norm(r.name), i]));

  const listKeys = ['newDisabilities', 'newPrimaryDisabilities'];
  const survivors = { newDisabilities: [], newPrimaryDisabilities: [] };

  for (const key of listKeys) {
    const list = Array.isArray(formData[key]) ? formData[key] : [];
    for (const row of list) {
      // eslint-disable-next-line no-continue
      if (!row) continue;

      const condIsRated = isRatedDisabilityCondition(row.condition);
      const nameMatchesRated =
        typeof row.ratedDisability === 'string' &&
        indexByName.has(norm(row.ratedDisability));

      if (condIsRated || nameMatchesRated) {
        if (nameMatchesRated) {
          const idx = indexByName.get(norm(row.ratedDisability));
          const target = rated[idx];
          target['view:selected'] = true;
          target.disabilityActionType = 'INCREASE';
          if (row.conditionDate && !target.approximateDate) {
            target.approximateDate = row.conditionDate;
          }
        }
        // eslint-disable-next-line no-continue
        continue;
      }

      survivors[key].push(row);
    }
  }

  const out = { ...formData, ratedDisabilities: rated };
  for (const key of listKeys) {
    if (survivors[key].length) out[key] = survivors[key];
    else if (key in out) delete out[key];
  }
  return out;
};

export const sanitizeNewDisabilities = formData => {
  if (!formData?.disabilityCompNewConditionsWorkflow) return formData;

  const out = { ...formData };

  const clean = key => {
    if (!Array.isArray(out[key])) return;
    const filtered = out[key].filter(r => r && r.condition && r.cause);
    if (filtered.length) out[key] = filtered;
    else delete out[key];
  };

  clean('newDisabilities');
  clean('newPrimaryDisabilities');

  return out;
};

export const removeRatedDisabilityFromNew = formData => {
  const out = { ...formData };
  const rated = Array.isArray(out.ratedDisabilities)
    ? out.ratedDisabilities
    : [];
  const ratedNameSet = new Set(rated.map(r => norm(r.name)));

  const keys = [
    'newDisabilities',
    'newPrimaryDisabilities',
    'newSecondaryDisabilities',
  ];
  for (const key of keys) {
    // eslint-disable-next-line no-continue
    if (!Array.isArray(out[key])) continue;

    const filtered = out[key].filter(r => {
      const condIsRated =
        typeof r?.condition === 'string' &&
        isRatedDisabilityCondition(r.condition);
      const nameMatchesRated =
        typeof r?.ratedDisability === 'string' &&
        ratedNameSet.has(norm(r.ratedDisability));
      // Drop only true increases
      return !(condIsRated || nameMatchesRated);
    });

    if (filtered.length) out[key] = filtered;
    else delete out[key];
  }
  return out;
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

/**
 * Cycles through the list of provider facilities and performs transformations on each property as needed
 * @param {array} providerFacilities array of objects being transformed
 * @returns {array} containing the new Provider Facility structure
 */
export function transformProviderFacilities(providerFacilities, clonedData) {
  // This map transforms treatedDisabilityNames back into the original condition names from the sippableIds
  return providerFacilities.map(facility => {
    const disabilityNames = transformRelatedDisabilities(
      facility.treatedDisabilityNames || [],
      getClaimedConditionNames(clonedData, false),
    );

    return {
      ...facility,
      treatedDisabilityNames: disabilityNames,
      treatmentDateRange: [facility.treatmentDateRange],
    };
  });
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
  } else {
    delete clonedData.ratedDisabilities;
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
  // migrate branches in case prefill migration is skipped somehow
  const newFormData = migrateBranches(formData);
  const { serviceInformation } = newFormData;
  if (!serviceInformation || hasGuardOrReservePeriod(serviceInformation)) {
    return newFormData;
  }
  // remove `reservesNationalGuardService` since no associated
  // Reserve or National guard service periods have been provided
  // see https://github.com/department-of-veterans-affairs/va.gov-team/issues/6797
  delete newFormData.serviceInformation.reservesNationalGuardService;
  return newFormData;
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
  if (newVAFacilities.length) {
    clonedData.vaTreatmentFacilities = newVAFacilities;
  } else {
    delete clonedData.vaTreatmentFacilities;
  }
  return clonedData;
};

export const cleanUpPersonsInvolved = (incident = {}) => {
  // We don't want to require any PTSD entries, but EVSS is rejecting any
  // personsInvolved that don't have a "injuryDeath" type set. So we're
  // setting blank entries to "other" and adding a generic other description
  // see https://github.com/department-of-veterans-affairs/va.gov-team/issues/21422
  const personsInvolved = incident.personsInvolved?.map((person = {}) => {
    const name = ['first', 'middle', 'last'].reduce(
      (fullName, part) => ({
        ...fullName,
        [part]: person.name?.[part] || '',
      }),
      {},
    );
    return person.injuryDeath
      ? { ...person, name }
      : {
          ...person,
          name,
          injuryDeath: 'other',
          injuryDeathOther: person.injuryDeathOther || 'Entry left blank',
        };
  });
  return personsInvolved?.length ? { ...incident, personsInvolved } : incident;
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

  // Helper to normalize address lines (trim and collapse multiple spaces)
  const normalizeAddressLine = val => {
    if (!val) return val;
    return val.trim().replace(/\s{2,}/g, ' ');
  };

  const addressLineKeys = ['addressLine1', 'addressLine2', 'addressLine3'];

  const mailingAddress = Object.entries(formData.mailingAddress).reduce(
    (address, [key, value]) => {
      if (value && validKeys.includes(key)) {
        // Normalize address lines before submission
        const normalizedValue = addressLineKeys.includes(key)
          ? normalizeAddressLine(value)
          : value;
        return {
          ...address,
          [key]: normalizedValue,
        };
      }
      return address;
    },
    {},
  );
  return { ...formData, mailingAddress };
};

// Add 'cause' of 'NEW' to new ptsd disabilities since form does not ask
export const addPTSDCause = formData => {
  const clonedData = formData.newDisabilities
    ? _.set(
        'newDisabilities',
        formData.newDisabilities.map(disability => {
          if (isDisabilityPtsd(disability?.condition)) {
            const updated = _.set('cause', causeTypes.NEW, disability);

            // Adds PTSD description for Veterans bypassing form 781
            return formData.skip781ForCombatReason ||
              formData.skip781ForNonCombatReason
              ? _.set('primaryDescription', ptsdBypassDescription, updated)
              : updated;
          }
          return disability;
        }),
        formData,
      )
    : formData;
  delete clonedData.skip781ForCombatReason;
  delete clonedData.skip781ForNonCombatReason;
  return clonedData;
};

export const addForm4142 = formData => {
  if (!formData.providerFacility) {
    return formData;
  }

  // Flipper was on at submission time
  const completed2024Form = formData?.disability526Enable2024Form4142 === true;

  // If the 2024 form was completed but they revoke auth at some point and still somehow submit with the 4142 data
  // protect against filling out the form
  if (completed2024Form && formData?.patient4142Acknowledgement !== true) {
    return formData;
  }

  const clonedData = _.cloneDeep(formData);
  clonedData.form4142 = {
    completed2024Form,
    ...(clonedData.limitedConsent && {
      limitedConsent: clonedData.limitedConsent,
    }),
    ...(clonedData.providerFacility && {
      providerFacility: transformProviderFacilities(
        clonedData.providerFacility,
        clonedData,
      ),
    }),
  };
  delete clonedData.limitedConsent;
  if (!clonedData.syncModern0781Flow) {
    delete clonedData.providerFacility;
  }
  return clonedData;
};

// This function is a failsafe redundancy to BehaviorIntroCombatPage.jsx > deleteBehavioralAnswers()
export const delete0781BehavioralData = formData => {
  const clonedData = _.cloneDeep(formData);

  delete clonedData.workBehaviors;
  delete clonedData.otherBehaviors;
  delete clonedData.healthBehaviors;
  delete clonedData.behaviorsDetails;

  return clonedData;
};

const delete0781FormData = formData => {
  const clonedData = delete0781BehavioralData(_.cloneDeep(formData));

  // Remove top-level keys
  [
    'events',
    'eventTypes',
    'supportingEvidenceRecords',
    'supportingEvidenceReports',
    'supportingEvidenceUnlisted',
    'supportingEvidenceWitness',
    'supportingEvidenceOther',
    'supportingEvidenceNoneCheckbox',
    'optionIndicator',
    'treatmentReceivedNonVaProvider',
    'treatmentReceivedVaProvider',
    'treatmentNoneCheckbox',
    'additionalInformation',
  ].forEach(key => {
    delete clonedData[key];
  });

  return clonedData;
};

export const sanitize0781PoliceReportData = formData => {
  const clonedData = _.cloneDeep(formData);

  if (Array.isArray(clonedData.events)) {
    for (let i = 0; i < clonedData.events.length; i++) {
      const event = clonedData.events[i];
      // If reports is missing or police is explicitly false, remove location fields
      if (!event.reports || event.reports.police === false) {
        delete event.agency;
        delete event.city;
        delete event.country;
        delete event.state;
        delete event.township;
      }
    }
  }

  return clonedData;
};

// This function is a failsafe redundancy for BehaviorListPage.jsx > deleteBehaviorDetails()
export const sanitize0781BehaviorsDetails = formData => {
  const clonedData = _.cloneDeep(formData);

  if (clonedData.behaviorsDetails) {
    const work = clonedData.workBehaviors || {};
    const health = clonedData.healthBehaviors || {};
    const other = clonedData.otherBehaviors || {};
    const noChange = clonedData.noBehavioralChange?.noChange === true;

    if (noChange) {
      // Clear all behaviorsDetails if "no change" is explicitly selected
      clonedData.behaviorsDetails = {};
    } else {
      Object.keys(clonedData.behaviorsDetails).forEach(key => {
        const isSelected =
          work[key] === true || health[key] === true || other[key] === true;

        if (!isSelected) {
          delete clonedData.behaviorsDetails[key];
        }
      });
    }
  }

  return clonedData;
};

export const addForm0781 = formData => {
  if (formData.syncModern0781Flow === true) {
    return formData;
  }

  const clonedData = _.cloneDeep(formData);
  const incidentKeys = getFlatIncidentKeys();
  const incidents = incidentKeys
    .filter(incidentKey => clonedData[incidentKey])
    .map(incidentKey => ({
      ...cleanUpPersonsInvolved(clonedData[incidentKey]),
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

/**
 * Extracts the month and year from a date string in the format YYYY-MM-DD
 * If the date is missing or invalid, returns empty strings
 *
 * @param {string} dateString the date string to parse
 * @returns {object} object containing `treatmentMonth` (MM) and `treatmentYear` (YYYY)
 */
export function extractDateParts(dateString) {
  const match = dateString?.match(/^(\d{4}|\D+)-(\d{2}|\D+)/);
  return {
    treatmentMonth: match && /^\d{2}$/.test(match[2]) ? match[2] : '',
    treatmentYear: match && /^\d{4}$/.test(match[1]) ? match[1] : '',
  };
}

/**
 * Transforms a provider facility object into the required structure
 * Extracts relevant address information and formats it as a comma-separated string
 *
 * @param {object} facility the provider facility object to transform
 * @returns {object} transformed facility with `facilityInfo`, `treatmentMonth`, and `treatmentYear`
 */
export function transformProviderFacility(facility) {
  const facilityInfo = [
    facility.providerFacilityName,
    facility.providerFacilityAddress?.street,
    facility.providerFacilityAddress?.street2,
    facility.providerFacilityAddress?.city,
    facility.providerFacilityAddress?.state,
    facility.providerFacilityAddress?.postalCode,
    facility.providerFacilityAddress?.country,
  ]
    .filter(Boolean)
    .join(', ');

  const { treatmentMonth, treatmentYear } = extractDateParts(
    facility.treatmentDateRange?.from,
  );

  return { facilityInfo, treatmentMonth, treatmentYear };
}

/**
 * Transforms a VA facility object into the required structure
 * Extracts relevant address information and formats it as a comma-separated string
 *
 * @param {object} facility the VA facility object to transform
 * @returns {object} transformed facility with `facilityInfo`, `treatmentMonth`, and `treatmentYear`
 */
export function transformVaFacility(facility) {
  const facilityInfo = [
    facility.treatmentCenterName,
    facility.treatmentCenterAddress?.city,
    facility.treatmentCenterAddress?.state,
    facility.treatmentCenterAddress?.country,
  ]
    .filter(Boolean)
    .join(', ');

  const { treatmentMonth, treatmentYear } = extractDateParts(
    facility.treatmentDateRange?.from,
  );

  return { facilityInfo, treatmentMonth, treatmentYear };
}

/**
 * Transforms and filters treatment facilities from both provider and VA sources
 * Only includes facilities where `treatmentLocation0781Related` is true
 *
 * @param {array} providerFacilities array of provider facility objects to transform
 * @param {array} vaFacilities array of VA facility objects to transform
 * @returns {array} array of transformed facility objects
 */
export function transformTreatmentFacilities(
  providerFacilities = [],
  vaFacilities = [],
) {
  return [
    ...providerFacilities
      .filter(f => f.treatmentLocation0781Related)
      .map(transformProviderFacility),
    ...vaFacilities
      .filter(f => f.treatmentLocation0781Related)
      .map(transformVaFacility),
  ];
}

export const addForm0781V2 = formData => {
  if (!formData.syncModern0781Flow) {
    return formData;
  }

  // If a user selected any workflow option other than submitting the online form,
  // all 0781-related data should be removed
  if (
    formData.mentalHealthWorkflowChoice !==
    form0781WorkflowChoices.COMPLETE_ONLINE_FORM
  ) {
    return delete0781FormData(formData);
  }

  if (formData.answerCombatBehaviorQuestions === 'false') {
    delete0781BehavioralData(formData);
  }

  sanitize0781PoliceReportData(formData);
  sanitize0781BehaviorsDetails(formData);

  const clonedData = _.cloneDeep(formData);

  clonedData.form0781 = {
    ...(clonedData.eventTypes && { eventTypes: clonedData.eventTypes }),
    ...(clonedData.events && { events: clonedData.events }),
    ...(clonedData.workBehaviors && {
      workBehaviors: clonedData.workBehaviors,
    }),
    ...(clonedData.healthBehaviors && {
      healthBehaviors: clonedData.healthBehaviors,
    }),
    ...(clonedData.otherBehaviors && {
      otherBehaviors: clonedData.otherBehaviors,
    }),
    ...(clonedData.behaviorsDetails && {
      behaviorsDetails: clonedData.behaviorsDetails,
    }),
    ...(clonedData.supportingEvidenceReports && {
      supportingEvidenceReports: clonedData.supportingEvidenceReports,
    }),
    ...(clonedData.supportingEvidenceRecords && {
      supportingEvidenceRecords: clonedData.supportingEvidenceRecords,
    }),
    ...(clonedData.supportingEvidenceWitness && {
      supportingEvidenceWitness: clonedData.supportingEvidenceWitness,
    }),
    ...(clonedData.supportingEvidenceOther && {
      supportingEvidenceOther: clonedData.supportingEvidenceOther,
    }),
    ...(clonedData.supportingEvidenceUnlisted && {
      supportingEvidenceUnlisted: clonedData.supportingEvidenceUnlisted,
    }),
    ...(clonedData.supportingEvidenceNoneCheckbox && {
      supportingEvidenceNoneCheckbox: clonedData.supportingEvidenceNoneCheckbox,
    }),
    ...(clonedData.treatmentReceivedVaProvider && {
      treatmentReceivedVaProvider: clonedData.treatmentReceivedVaProvider,
    }),
    ...(clonedData.treatmentReceivedNonVaProvider && {
      treatmentReceivedNonVaProvider: clonedData.treatmentReceivedNonVaProvider,
    }),
    ...(clonedData.treatmentNoneCheckbox && {
      treatmentNoneCheckbox: clonedData.treatmentNoneCheckbox,
    }),
    ...(!!clonedData.providerFacility || !!clonedData.vaTreatmentFacilities
      ? {
          treatmentProvidersDetails: transformTreatmentFacilities(
            clonedData.providerFacility || [],
            clonedData.vaTreatmentFacilities || [],
          ),
        }
      : {}),
    ...(clonedData.optionIndicator && {
      optionIndicator: clonedData.optionIndicator,
    }),
    ...(clonedData.additionalInformation && {
      additionalInformation: clonedData.additionalInformation,
    }),
  };

  delete clonedData.eventTypes;
  delete clonedData.events;
  delete clonedData.noBehavioralChange;
  delete clonedData.workBehaviors;
  delete clonedData.healthBehaviors;
  delete clonedData.otherBehaviors;
  delete clonedData.behaviorsDetails;
  delete clonedData.supportingEvidenceReports;
  delete clonedData.supportingEvidenceRecords;
  delete clonedData.supportingEvidenceWitness;
  delete clonedData.supportingEvidenceOther;
  delete clonedData.supportingEvidenceUnlisted;
  delete clonedData.supportingEvidenceNoneCheckbox;
  delete clonedData.treatmentReceivedVaProvider;
  delete clonedData.treatmentReceivedNonVaProvider;
  delete clonedData.treatmentNoneCheckbox;
  delete clonedData.providerFacility;
  delete clonedData.optionIndicator;
  delete clonedData.additionalInformation;

  return clonedData;
};

export const addForm8940 = formData => {
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
export const addFileAttachments = formData => {
  const clonedData = _.cloneDeep(formData);
  let attachments = [];

  ATTACHMENT_KEYS.forEach(key => {
    const documentArr = _.get(key, clonedData, []);
    attachments = [...attachments, ...documentArr];
    delete clonedData[key];
  });
  return { ...clonedData, ...(attachments.length && { attachments }) };
};

/**
 * Check validations for Custom pages
 * @param {Function[]} validations - array of validation functions
 * @param {*} data - field data passed to the validation function
 * @param {*} fullData - full and appStateData passed to validation function
 * @param {*} index - array index if within an array
 * @returns {String[]} - error messages
 *
 * Copied from src/applications/appeals/shared/validations/index.js, because we don't allow cross-app imports
 */
export const checkValidations = (
  validations = [],
  data = {},
  fullData = {},
  index,
) => {
  const errors = { errorMessages: [] };
  errors.addError = message => errors.errorMessages.push(message);
  /* errors, fieldData, formData, schema, uiSchema, index, appStateData */
  validations.map(validation =>
    validation(errors, data, fullData, null, null, index, fullData),
  );
  return errors.errorMessages;
};
