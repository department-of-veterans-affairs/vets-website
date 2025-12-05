import cloneDeep from 'lodash/cloneDeep';
import { parse, parseISO, isValid } from 'date-fns';

import omit from 'platform/utilities/data/omit';
import { dataDogLogger } from 'platform/monitoring/Datadog/utilities';

import {
  filterInactivePageData,
  getActivePages,
  getInactivePages,
  stringifyFormReplacer,
  expandArrayPages,
  createFormPageList,
} from 'platform/forms-system/src/js/helpers';
import { validateWhiteSpace } from 'platform/forms/validations';

import { MARRIAGE_TYPES, PICKLIST_DATA } from '../constants';

export const validateName = (errors, pageData) => {
  const { first, last } = pageData;
  validateWhiteSpace(errors.first, first);
  validateWhiteSpace(errors.last, last);
};

const PHONE_KEYS = ['phoneNumber', 'internationalPhone'];

/**
 * Cleans up form data for submission; m* Mostly copied from the platform provided stringifyFormReplacer, with the
 * removal of the address check. We don't need it here for our location use.
 * @param {string} key - form data field key
 * @param {any} value - form data field value
 * @returns {any} - cleaned form data field value
 */
export const customFormReplacer = (key, value) => {
  // Remove all non-digit characters from phone-related fields
  if (typeof value === 'string' && PHONE_KEYS.includes(key)) {
    return value.replace(/\D/g, '');
  }
  // clean up empty objects, which we have no reason to send
  if (typeof value === 'object' && value !== null) {
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
      return omit('file', value);
    }
  }
  // Clean up empty objects in arrays
  if (Array.isArray(value)) {
    const newValues = value.filter(v => !!stringifyFormReplacer(key, v));
    // If every item in the array is cleared, remove the whole array
    return newValues.length > 0 ? newValues : undefined;
  }

  return value;
};

/**
 * Extract data fields with values from source data
 *
 * Returns only fields that have meaningful data (non-empty values/arrays).
 * This prevents accidentally setting flags when no actual data exists, fixing
 * a bug where options could be enabled without corresponding data.
 *
 * @param {object} sourceData - source data object
 * @param {string[]} fields - fields to extract
 * @returns {object} object containing only fields with data
 */
function extractDataFields(sourceData, fields) {
  const result = {};
  fields.forEach(field => {
    const value = sourceData[field];
    if (Array.isArray(value) ? value.length > 0 : value) {
      result[field] = cloneDeep(value);
    }
  });
  return result;
}

/**
 * Transform form data into submission data format
 * @param {object} payload - form object from Redux store
 * @returns {object} - submission data object
 */
export function buildSubmissionData(payload) {
  if (!payload?.data) {
    return payload;
  }

  const sourceData = payload.data;
  const cleanData = {};

  const addEnabled = sourceData['view:addOrRemoveDependents']?.add === true;
  const removeEnabled =
    sourceData['view:addOrRemoveDependents']?.remove === true;
  const addOptions = sourceData['view:addDependentOptions'] || {};
  const removeOptions = sourceData['view:removeDependentOptions'] || {};

  // Always include these - needed for BE
  Object.assign(cleanData, {
    useV2: true,
    daysTillExpires: 365,
  });

  const essentialFields = [
    'veteranInformation',
    'veteranContactInformation',
    'statementOfTruthSignature',
    'statementOfTruthCertified',
    'metadata',
  ];

  essentialFields.forEach(field => {
    if (sourceData[field]) {
      cleanData[field] = sourceData[field];
    }
  });

  // Handle fields that can be undefined/false - vaDependentsNetWorthAndPension recently added to formData
  ['householdIncome', 'vaDependentsNetWorthAndPension'].forEach(field => {
    if (sourceData[field] !== undefined) {
      cleanData[field] = sourceData[field];
    }
  });

  const addDataMappings = {
    addSpouse: [
      'currentMarriageInformation',
      'doesLiveWithSpouse',
      'spouseInformation',
      'spouseSupportingDocuments',
      'spouseMarriageHistory',
      'veteranMarriageHistory',
    ],
    addChild: ['childrenToAdd', 'childSupportingDocuments'],
    addDisabledChild: ['childrenToAdd', 'childSupportingDocuments'],
    report674: ['studentInformation'],
  };

  const removeDataMappings = {
    reportDivorce: ['reportDivorce'],
    reportDeath: ['deaths'],
    reportStepchildNotInHousehold: ['stepChildren'],
    reportMarriageOfChildUnder18: ['childMarriage'],
    reportChild18OrOlderIsNotAttendingSchool: ['childStoppedAttendingSchool'],
  };

  // Add options
  const enabledAddOptions = {};
  if (addEnabled) {
    Object.entries(addDataMappings).forEach(([option, fields]) => {
      if (addOptions[option] === true) {
        const optionData = extractDataFields(sourceData, fields);
        if (Object.keys(optionData).length > 0) {
          Object.assign(cleanData, optionData);
          enabledAddOptions[option] = true;
        }
      }
    });
  }

  // Remove options
  const enabledRemoveOptions = {};
  if (removeEnabled) {
    Object.entries(removeDataMappings).forEach(([option, fields]) => {
      if (removeOptions[option] === true) {
        const optionData = extractDataFields(sourceData, fields);
        if (Object.keys(optionData).length > 0) {
          Object.assign(cleanData, optionData);
          enabledRemoveOptions[option] = true;
        }
      }
    });
  }

  if (Object.keys(enabledAddOptions).length > 0) {
    cleanData['view:addDependentOptions'] = enabledAddOptions;
  }

  if (Object.keys(enabledRemoveOptions).length > 0) {
    cleanData['view:removeDependentOptions'] = enabledRemoveOptions;
  }

  const mainControl = {};
  if (addEnabled && Object.keys(enabledAddOptions).length > 0) {
    mainControl.add = true;
  }
  if (removeEnabled && Object.keys(enabledRemoveOptions).length > 0) {
    mainControl.remove = true;
  }

  if (Object.keys(mainControl).length > 0) {
    cleanData['view:addOrRemoveDependents'] = mainControl;
  }

  const selectableOptions = { ...enabledAddOptions, ...enabledRemoveOptions };
  if (Object.keys(selectableOptions).length > 0) {
    cleanData['view:selectable686Options'] = selectableOptions;
  }

  return { ...payload, data: cleanData };
}

/**
 * parseDateToDateObj from ISO8601 or JS number date (not unix time)
 * @param {string|number|Date} date - date to format
 * @param {string} template - date template for parsing non-ISO strings
 * @returns {dateObj|null} date object
 */
export const parseDateToDateObj = (date, template) => {
  let newDate = date;
  if (typeof date === 'string') {
    if (date.includes('T')) {
      newDate = parseISO((date || '').split('T')[0]);
    } else if (template) {
      newDate = parse(date, template, new Date());
    }
  } else if (date instanceof Date && isValid(date)) {
    // Remove timezone offset - the only time we pass in a date object is for
    // unit tests (see https://stackoverflow.com/a/67599505)
    newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset());
  }
  return isValid(newDate) ? newDate : null;
};

/**
 * Get spouse evidence requirements from form data
 * @param {object} formData - form data object
 * @returns {object} - spouse evidence requirements
 */
export const spouseEvidence = (formData = {}) => {
  const { veteranAddress } = formData.veteranContactInformation || {};
  const isOutsideUSA =
    veteranAddress?.country !== 'USA' || Boolean(veteranAddress?.isMilitary);

  const { typeOfMarriage } = formData.currentMarriageInformation || {};
  const isCommonLawMarriage = typeOfMarriage === MARRIAGE_TYPES.commonLaw;
  const isTribalMarriage = typeOfMarriage === MARRIAGE_TYPES.tribal;
  const isProxyMarriage = typeOfMarriage === MARRIAGE_TYPES.proxy;
  const needsSpouseUpload =
    typeof typeOfMarriage === 'string' &&
    typeOfMarriage !== MARRIAGE_TYPES.ceremonial;

  return {
    isCommonLawMarriage,
    isTribalMarriage,
    isProxyMarriage,
    isOutsideUSA,
    needsSpouseUpload,
  };
};

/**
 * Get child evidence requirements from form data
 * @param {object} formData - form data object
 * @returns {object} - child evidence requirements
 */
export const childEvidence = (formData = {}) => {
  const veteranAddress =
    formData?.veteranContactInformation?.veteranAddress || {};
  const livesOutsideUSA =
    veteranAddress.country !== 'USA' || veteranAddress.isMilitary;

  const childrenToAdd = formData?.childrenToAdd || [];
  const hasStepChild = childrenToAdd.some(
    childFormData => childFormData?.relationshipToChild?.stepchild,
  );
  const hasAdoptedChild = childrenToAdd.some(
    childFormData => childFormData?.relationshipToChild?.adopted,
  );
  const hasDisabledChild = childrenToAdd.some(
    childFormData =>
      childFormData?.doesChildHaveDisability &&
      childFormData?.doesChildHavePermanentDisability,
  );

  const showBirthCertificate = livesOutsideUSA || hasStepChild;

  return {
    showBirthCertificate,
    hasAdoptedChild,
    hasDisabledChild,
    needsChildUpload:
      showBirthCertificate || hasDisabledChild || hasAdoptedChild,
  };
};

export const showDupeModalIfEnabled = (formData = {}) =>
  !!formData.vaDependentsDuplicateModals;

export const isAddingDependents = formData =>
  !!formData?.['view:addOrRemoveDependents']?.add;
export const isRemovingDependents = formData =>
  !!formData?.['view:addOrRemoveDependents']?.remove;

// Go through v3 picklist unless Veteran has a v2 for in progress
export const showV3Picklist = formData =>
  !!formData?.vaDependentsV3 && formData?.vaDependentV2Flow !== true;
export const noV3Picklist = formData => !showV3Picklist(formData);
export const showOptionsSelection = formData =>
  showV3Picklist(formData) ? formData.dependents?.awarded.length > 0 : true;

export const hasAwardedDependents = (formData = {}) =>
  Array.isArray(formData?.dependents?.awarded) &&
  formData.dependents.awarded.length > 0;

export const isVisiblePicklistPage = (formData, relationship) => {
  const pickList = formData?.[PICKLIST_DATA] || [];
  return (
    (showV3Picklist(formData) &&
      formData?.['view:addOrRemoveDependents']?.remove &&
      pickList.some(
        item => item.selected && item.relationshipToVeteran === relationship,
      )) ||
    false
  );
};

export const hasSelectedPicklistItems = formData =>
  (formData?.[PICKLIST_DATA] || []).some(item => item.selected);

/**
 * Build location object for V2 format
 * @param {Object} item - Picklist item with location fields
 * @returns {Object} V2 location format
 */
function buildLocation(item) {
  if (item.endOutsideUs === true) {
    return {
      outsideUsa: true,
      location: {
        city: item.endCity || '',
        country: item.endCountry || '',
      },
    };
  }

  return {
    outsideUsa: false,
    location: {
      city: item.endCity || '',
      state: item.endState || '',
    },
  };
}

/**
 * Transform V3 picklist item with removalReason: 'childMarried' to V2 format
 * @param {Object} item - Picklist item
 * @returns {Object} V2 childMarriage format
 */
function transformChildMarriage(item) {
  return {
    fullName: item.fullName,
    ssn: item.ssn,
    birthDate: item.dateOfBirth,
    dateMarried: item.endDate,
    // TODO: Confirm income field source - currently defaulting to 'N'
    dependentIncome: 'N',
  };
}

/**
 * Transform V3 picklist item with removalReason: 'childNotInSchool' to V2 format
 * @param {Object} item - Picklist item
 * @returns {Object} V2 childStoppedAttendingSchool format
 */
function transformChildNotInSchool(item) {
  return {
    fullName: item.fullName,
    ssn: item.ssn,
    birthDate: item.dateOfBirth,
    dateChildLeftSchool: item.endDate,
    // TODO: Confirm income field source - currently defaulting to 'N'
    dependentIncome: 'N',
  };
}

/**
 * Transform V3 picklist item with removalReason: 'childDied' to V2 format
 * @param {Object} item - Picklist item
 * @returns {Object} V2 deaths format (child)
 */
function transformChildDeath(item) {
  return {
    fullName: item.fullName,
    ssn: item.ssn,
    birthDate: item.dateOfBirth,
    dependentType: 'CHILD',
    dependentDeathDate: item.endDate,
    dependentDeathLocation: buildLocation(item),
    // TODO: Confirm income field source - currently defaulting to 'N'
    deceasedDependentIncome: 'N',
    childStatus: {
      childUnder18: item.age < 18,
      // assume disabled if over 23, we'll add a specific question later
      // childOver18InSchool: true, // Can't assume this
      disabled: item.age > 23,
      stepChild: item.isStepchild === 'Y',
      // adopted: null, // Optional field
    },
  };
}

/**
 * Transform V3 picklist item with removalReason: 'marriageEnded' to V2 format
 * @param {Object} item - Picklist item
 * @returns {Object} V2 reportDivorce format
 */
function transformSpouseDivorce(item) {
  // Map V3 endType to V2 reasonMarriageEnded
  const reasonMap = {
    divorce: 'Divorce',
    annulmentOrVoid: 'Annulment',
    other: 'Other',
  };

  return {
    fullName: item.fullName,
    ssn: item.ssn,
    birthDate: item.dateOfBirth,
    date: item.endDate,
    // TODO: Should we support Other option or default to annulmentOrVoid
    reasonMarriageEnded: reasonMap[item.endType] || 'Other',
    explanationOfOther: item.endAnnulmentOrVoidDescription || '',
    divorceLocation: buildLocation(item),
    // TODO: Confirm income field source - currently defaulting to 'N'
    spouseIncome: 'N',
  };
}

/**
 * Transform V3 picklist item with removalReason: 'spouseDied' (spouse) to V2 format
 * @param {Object} item - Picklist item
 * @returns {Object} V2 deaths format (spouse)
 */
function transformSpouseDeath(item) {
  return {
    fullName: item.fullName,
    ssn: item.ssn,
    birthDate: item.dateOfBirth,
    dependentType: 'SPOUSE',
    dependentDeathDate: item.endDate,
    dependentDeathLocation: buildLocation(item),
    // TODO: Confirm income field source - currently defaulting to 'N'
    // Pension related question. Perhaps should be a conditional question we add to the flow?
    deceasedDependentIncome: 'N',
  };
}

/**
 * Transform V3 picklist item with removalReason: 'parentDied' to V2 format
 * @param {Object} item - Picklist item
 * @returns {Object} V2 deaths format (parent)
 */
function transformParentDeath(item) {
  return {
    fullName: item.fullName,
    ssn: item.ssn,
    birthDate: item.dateOfBirth,
    dependentType: 'DEPENDENT_PARENT',
    dependentDeathDate: item.endDate,
    dependentDeathLocation: buildLocation(item),
    // TODO: Confirm income field source - currently defaulting to 'N'
    deceasedDependentIncome: 'N',
  };
}

/**
 * Transform V3 picklist item where isStepchild === 'Y' to V2 stepChildren format
 * Used for any child removal reason where the child is identified as a stepchild
 * @param {Object} item - Picklist item
 * @returns {Object} V2 stepChildren format
 */
function transformStepchildByFlag(item) {
  const baseData = {
    fullName: item.fullName,
    ssn: item.ssn,
    birthDate: item.dateOfBirth,
  };

  if (item.removalReason === 'stepchildNotMember') {
    return {
      ...baseData,
      dateStepchildLeftHousehold: item.endDate,
      whoDoesTheStepchildLiveWith: item.whoDoesTheStepchildLiveWith || {},
      address: item.address || {},
      livingExpensesPaid: 'Less than half',
      supportingStepchild: false,
    };
  }

  return baseData;
}

/**
 * Transforms V3 picklist removal data to V2 format
 * Mutates the data object in place
 * @param {Object} data - Form data object
 * @returns {Object} data - Transformed data object
 */
export function transformPicklistToV2(data) {
  const picklist = data[PICKLIST_DATA] || [];
  const selected = picklist.filter(item => item.selected === true);

  if (selected.length === 0) {
    return data;
  }

  // Filter out items that should not be transformed
  const itemsToTransform = selected.filter(item => {
    // Skip stepchild left household with financial support > 50%
    if (
      item.isStepchild === 'Y' &&
      item.removalReason === 'stepchildNotMember' &&
      item.stepchildFinancialSupport === 'Y'
    ) {
      return false;
    }

    // Skip child not in school with permanent disability
    if (
      item.removalReason === 'childNotInSchool' &&
      item.childHasPermanentDisability === 'Y'
    ) {
      return false;
    }

    return true;
  });

  // Initialize V2 arrays
  const v2Data = {
    deaths: [],
    childMarriage: [],
    childStoppedAttendingSchool: [],
    stepChildren: [],
    reportDivorce: null,
  };

  // Routing table: removalReason -> [arrayName, transformFn] or [[default], [stepchild]]
  const routes = {
    // Deaths - all dependent types go to deaths array
    childDied: ['deaths', transformChildDeath],
    spouseDied: ['deaths', transformSpouseDeath],
    parentDied: ['deaths', transformParentDeath],

    // Child married - stepchildren go to stepChildren, others to childMarriage
    childMarried: [
      ['childMarriage', transformChildMarriage], // default
      ['stepChildren', transformStepchildByFlag], // stepchild
    ],

    // Child not in school - stepchildren go to stepChildren, others to childStoppedAttendingSchool
    childNotInSchool: [
      ['childStoppedAttendingSchool', transformChildNotInSchool], // default
      ['stepChildren', transformStepchildByFlag], // stepchild
    ],

    // Spouse divorce/annulment
    marriageEnded: ['reportDivorce', transformSpouseDivorce],

    // Stepchild left household
    stepchildNotMember: ['stepChildren', transformStepchildByFlag],

    // Child adopted (TODO: implement backend support for non-stepchild adoption)
    childAdopted: ['stepChildren', transformStepchildByFlag],

    // Parent other - not supported
    parentOther: null,
  };

  itemsToTransform.forEach(item => {
    const route = routes[item.removalReason];

    // Handle unknown removal reasons
    if (route === undefined) {
      dataDogLogger({
        message: 'Unknown removal reason in v3 to V2 transform',
        attributes: { removalReason: item.removalReason },
        status: 'error',
      });
      return;
    }

    // Skip unsupported removal reasons
    if (route === null) {
      return;
    }

    // Determine which route to use based on stepchild status
    let arrayName;
    let transformFn;
    if (Array.isArray(route[0])) {
      // Has stepchild override: [[default], [stepchild]]
      const routeIndex = item.isStepchild === 'Y' ? 1 : 0;
      [arrayName, transformFn] = route[routeIndex];
    } else {
      // Simple route: [arrayName, transformFn]
      [arrayName, transformFn] = route;
    }

    // Apply transformation and add to destination
    if (arrayName === 'reportDivorce') {
      // reportDivorce is single object, not array
      if (v2Data.reportDivorce) {
        dataDogLogger({
          message: 'Multiple spouses with marriageEnded in v3 to V2 transform',
          attributes: {},
        });
      } else {
        v2Data.reportDivorce = transformFn(item);
      }
    } else {
      // Add to array
      v2Data[arrayName].push(transformFn(item));
    }
  });

  // Copy to data object (only if arrays/object exist)
  if (v2Data.deaths.length > 0) {
    // eslint-disable-next-line no-param-reassign
    data.deaths = v2Data.deaths;
  }
  if (v2Data.childMarriage.length > 0) {
    // eslint-disable-next-line no-param-reassign
    data.childMarriage = v2Data.childMarriage;
  }
  if (v2Data.childStoppedAttendingSchool.length > 0) {
    // eslint-disable-next-line no-param-reassign
    data.childStoppedAttendingSchool = v2Data.childStoppedAttendingSchool;
  }
  if (v2Data.stepChildren.length > 0) {
    // eslint-disable-next-line no-param-reassign
    data.stepChildren = v2Data.stepChildren;
  }
  if (v2Data.reportDivorce) {
    // eslint-disable-next-line no-param-reassign
    data.reportDivorce = v2Data.reportDivorce;
  }

  // Set removal options flags based on what was transformed
  // eslint-disable-next-line no-param-reassign
  data['view:removeDependentOptions'] = {
    reportDivorce: !!v2Data.reportDivorce,
    reportDeath: v2Data.deaths.length > 0,
    reportStepchildNotInHousehold: v2Data.stepChildren.length > 0,
    reportMarriageOfChildUnder18: v2Data.childMarriage.length > 0,
    reportChild18OrOlderIsNotAttendingSchool:
      v2Data.childStoppedAttendingSchool.length > 0,
  };

  // eslint-disable-next-line no-param-reassign
  data['view:selectable686Options'] = {
    addSpouse: v2Data['view:selectable686Options']?.addSpouse || false,
    addChild: v2Data['view:selectable686Options']?.addChild || false,
    report674: v2Data['view:selectable686Options']?.report674 || false,
    addDisabledChild:
      v2Data['view:selectable686Options']?.addDisabledChild || false,
    ...data['view:removeDependentOptions'],
  };

  return data;
}

/**
 * Get form data for submission
 * @param {object} formConfig - form configuration object
 * @param {object} form - form object from Redux store
 * @returns {object} - transformed form data
 */
export function customTransformForSubmit(formConfig, form) {
  const payload = cloneDeep(form);
  if (!payload.data) {
    payload.data = {};
  }
  payload.data.useV2 = true;
  payload.data.daysTillExpires = 365;

  const expandedPages = expandArrayPages(
    createFormPageList(formConfig),
    payload.data,
  );
  const activePages = getActivePages(expandedPages, payload.data);
  const inactivePages = getInactivePages(expandedPages, payload.data);
  const withoutInactivePages = filterInactivePageData(
    inactivePages,
    activePages,
    payload,
  );

  // Transform V3 picklist data to V2 format if V3 is enabled
  const updatedData = showV3Picklist(withoutInactivePages)
    ? transformPicklistToV2(withoutInactivePages)
    : withoutInactivePages;

  const cleanedPayload = buildSubmissionData(updatedData);

  return JSON.stringify(cleanedPayload, customFormReplacer) || '{}';
}
