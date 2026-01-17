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

import { MARRIAGE_TYPES, PICKLIST_DATA } from '../constants';
import {
  ADD_WORKFLOW_MAPPINGS,
  REMOVE_WORKFLOW_MAPPINGS,
  getV2Destination,
} from '../dataMappings';

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
 * Check if the form should go through v3 picklist unless Veteran has a v2 form
 * in progress
 * @param {object} formData - form data object
 * @returns {boolean} - true if v3 picklist should be shown
 */
export const showV3Picklist = formData =>
  !!formData?.vaDependentsV3 && formData?.vaDependentV2Flow !== true;

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
 *
 * SINGLE SOURCE OF TRUTH for submission flags:
 * This function is the authoritative source for view:selectable686Options
 * in the final submission. It rebuilds these flags based on actual data
 * presence, not on what the user selected in the wizard.
 *
 * Why this matters:
 * - User might select an option in the wizard but not complete the data entry
 * - Pages may be visible during editing (wizard sets navigation flags)
 * - But submission should only include flags for workflows with actual data
 * - This prevents backend errors like "flag is true but data is nil"
 *
 * @param {object} payload - form object from Redux store with structure { data: {...}, ... }
 * @returns {object} - submission data object with validated flags
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

  // Use centralized workflow mappings from dataMappings.js
  const addDataMappings = ADD_WORKFLOW_MAPPINGS;
  const removeDataMappings = REMOVE_WORKFLOW_MAPPINGS;

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
      // Support both V2 (checkbox) and V3 (picklist) flows:
      // - V2: removeOptions[option] is set when user checks the box - only check selected options
      // - V3: removeOptions is empty - check all options after picklist transformation
      const isV3Flow = showV3Picklist(sourceData);
      const shouldCheckOption = isV3Flow || removeOptions[option] === true;

      if (shouldCheckOption) {
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

/**
 * Check if duplicate modal should be shown
 * @param {object} formData - form data object
 * @returns {boolean} - true if duplicate modal should be shown
 */
export const showDupeModalIfEnabled = (formData = {}) =>
  !!formData.vaDependentsDuplicateModals;

/**
 * Check if adding dependents
 * @param {object} formData - form data object
 * @returns {boolean} - true if adding dependents
 */
export const isAddingDependents = formData =>
  !!formData?.['view:addOrRemoveDependents']?.add;

/**
 * Check if removing dependents
 * @param {object} formData - form data object
 * @returns {boolean} - true if removing dependents
 */
export const isRemovingDependents = formData =>
  !!formData?.['view:addOrRemoveDependents']?.remove;

/**
 * Show v2 flow if Veteran has a v2 form in progress
 * @param {object} formData - form data object
 * @returns {boolean} - true if v3 picklist should be shown
 */
export const noV3Picklist = formData => !showV3Picklist(formData);

/**
 * Check if there are awarded dependents in form data
 * @param {object} formData - form data object
 * @returns {boolean} - true if there are awarded dependents
 */
export const hasAwardedDependents = (formData = {}) =>
  Array.isArray(formData?.dependents?.awarded) &&
  formData.dependents.awarded.length > 0;

/**
 * If v3 flow is enabled, show options selection (add or remove question) if
 * there are awarded dependents and no dependents API error; if no awarded
 * dependents, only show the add dependents flow
 * @param {object} formData - form data object
 * @returns {boolean} - true if options selection should be shown
 */
export const showOptionsSelection = formData =>
  showV3Picklist(formData)
    ? !formData['view:dependentsApiError'] && hasAwardedDependents(formData)
    : true;

/**
 * If v3 picklist is enabled, check if remove flow is selected and if all the
 * dependents have a relationship value, then show the picklist page
 * @param {object} formData - form data object
 * @param {string} relationship - relationship to veteran
 * @returns {boolean} - true if picklist page is visible
 */
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

/**
 * Check if any picklist items are selected
 * @param {object} formData - form data object
 * @returns {boolean} - true if any picklist items are selected
 */
export const hasSelectedPicklistItems = formData =>
  (formData?.[PICKLIST_DATA] || []).some(item => item.selected);

/**
 * Transforms V3 picklist location data to V2 location format.
 *
 * Handles both US and international locations:
 * - US: { outsideUsa: false, location: { city, state } }
 * - International: { outsideUsa: true, location: { city, state (province), country } }
 *
 * NOTE: For international addresses, 'state' field contains the province value.
 * This follows the addressUI pattern from the platform forms system.
 *
 * @param {Object} item - Picklist item containing location fields
 * @param {boolean} item.endOutsideUs - Whether location is outside the US
 * @param {string} item.endCity - City name
 * @param {string} [item.endState] - State code (US addresses)
 * @param {string} [item.endProvince] - Province (international addresses)
 * @param {string} [item.endCountry] - Country code (international addresses)
 * @returns {Object} V2 location format with outsideUsa flag and location object
 */
function buildLocation(item) {
  if (item.endOutsideUs === true) {
    return {
      outsideUsa: true,
      location: {
        city: item.endCity || '',
        // Copying addressUI pattern, were 'state' is submitted for province
        state: item.endProvince || '',
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
 * @param {object} item - Picklist item
 * @returns {object} V2 childMarriage format
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
 * Validates that SSN is exactly 9 digits
 * @param {string} ssn - SSN to validate
 * @returns {boolean} true if SSN is exactly 9 digits
 */
function isValidSSN(ssn) {
  if (!ssn) return false;
  const digitsOnly = String(ssn).replace(/\D/g, '');
  return digitsOnly.length === 9;
}

/**
 * Normalizes SSN to digits only (removes dashes and other formatting)
 * @param {string} ssn - SSN to normalize
 * @returns {string} SSN with only digits
 */
function normalizeSSN(ssn) {
  if (!ssn) return '';
  return String(ssn).replace(/\D/g, '');
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

  const result = {
    fullName: item.fullName,
    birthDate: item.dateOfBirth,
    date: item.endDate,
    // TODO: Should we support Other option or default to annulmentOrVoid
    reasonMarriageEnded: reasonMap[item.endType] || 'Other',
    explanationOfOther: item.endAnnulmentOrVoidDescription || '',
    divorceLocation: buildLocation(item),
    // TODO: Confirm income field source - currently defaulting to 'N'
    spouseIncome: 'N',
  };

  // Only include SSN if it's exactly 9 digits, and normalize to digits only
  if (isValidSSN(item.ssn)) {
    result.ssn = normalizeSSN(item.ssn);
  }

  return result;
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
 * Transforms V3 picklist removal data to V2 format.
 *
 * TRANSFORMATION PROCESS:
 * 1. Filters selected dependents from picklist
 * 2. Excludes items that should remain in V3 format (e.g., stepchild with support > 50%)
 * 3. Routes each item to appropriate V2 array based on removal reason and stepchild status
 * 4. Applies transformation function specific to removal type
 * 5. Mutates data object by adding V2 arrays (deaths, childMarriage, etc.)
 *
 * V2 DATA ARRAYS:
 * - deaths[] - All death-related removals (child, spouse, parent)
 * - childMarriage[] - Child married (non-stepchildren only)
 * - childStoppedAttendingSchool[] - Child stopped school (non-stepchildren only)
 * - stepChildren[] - Stepchild-specific removals (left household, married, etc.)
 * - reportDivorce{} - Spouse divorce/annulment (single object, not array)
 *
 * IMPORTANT: This function does NOT set submission flags. Flags are rebuilt
 * by buildSubmissionData() based on actual data presence.
 *
 * @param {Object} data - Form data object containing view:removeDependentPickList
 * @returns {Object} Mutated data object with V2 arrays added
 */
export function transformPicklistToV2(data) {
  const picklist = data[PICKLIST_DATA] || [];
  const selected = picklist.filter(item => item.selected === true);

  if (selected.length === 0) {
    return data;
  }

  // Filter out items that should not be transformed
  const itemsToTransform = selected.filter(
    item =>
      // Skip stepchild left household with financial support > 50% &
      // Skip child not in school with permanent disability
      !(
        (item.isStepchild === 'Y' &&
          item.removalReason === 'stepchildNotMember' &&
          item.stepchildFinancialSupport === 'Y') ||
        (item.removalReason === 'childNotInSchool' &&
          item.childHasPermanentDisability === 'Y')
      ),
  );

  // Initialize V2 arrays
  const v2Data = {
    deaths: [],
    childMarriage: [],
    childStoppedAttendingSchool: [],
    stepChildren: [],
    reportDivorce: null,
  };

  // Map removal reasons to transformation functions
  // Destination arrays are determined by centralized routing in dataMappings.js
  const transformFunctions = {
    childDied: transformChildDeath,
    spouseDied: transformSpouseDeath,
    parentDied: transformParentDeath,
    childMarried: transformChildMarriage,
    childNotInSchool: transformChildNotInSchool,
    marriageEnded: transformSpouseDivorce,
    stepchildNotMember: transformStepchildByFlag,
    childAdopted: transformStepchildByFlag,
  };

  itemsToTransform.forEach(item => {
    const isStepchild = item.isStepchild === 'Y';

    // Get destination array from centralized routing
    const arrayName = getV2Destination(item.removalReason, isStepchild);

    // Handle unknown removal reasons
    if (arrayName === undefined) {
      dataDogLogger({
        message: 'Unknown removal reason in v3 to V2 transform',
        attributes: { removalReason: item.removalReason },
        status: 'error',
      });
      return;
    }

    // Skip unsupported removal reasons
    if (arrayName === null) {
      return;
    }

    // Get transformation function
    // For stepchild-routed items, use stepchild transform; otherwise use reason-specific transform
    const transformFn =
      isStepchild &&
      (item.removalReason === 'childMarried' ||
        item.removalReason === 'childNotInSchool')
        ? transformStepchildByFlag
        : transformFunctions[item.removalReason];

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

  /**
   * NOTE: We intentionally do NOT set view:removeDependentOptions or
   * view:selectable686Options here. Those flags are set by buildSubmissionData()
   * which is the single source of truth for submission flags.
   *
   * This function's responsibility is ONLY to transform V3 picklist data
   * into V2 data arrays. Flag validation happens later in the pipeline.
   */

  return data;
}

/**
 * Enrich reportDivorce with SSN from awarded dependents if available
 * Matches by fullName and birthDate to find the spouse in the awarded dependents
 * @param {Object} data - Form data object
 * @returns {Object} Enriched data object with SSN added to reportDivorce if found
 */
export function enrichDivorceWithSSN(data) {
  // Only process if reportDivorce exists and doesn't already have SSN
  if (!data?.reportDivorce || data.reportDivorce.ssn) {
    return data;
  }

  const { reportDivorce } = data;
  const awardedDependents = data?.dependents?.awarded || [];

  // Find matching spouse in awarded dependents
  const matchingSpouse = awardedDependents.find(dependent => {
    // Match by relationship type
    if (dependent.relationshipToVeteran !== 'Spouse') {
      return false;
    }

    // Match by name (case-insensitive)
    const {
      dateOfBirth: dependentBirthDate,
      fullName: { first, last, middle } = {},
    } = dependent;
    const {
      birthDate: reportDivorceBirthDate,
      fullName: {
        first: divorceFirst,
        last: divorceLast,
        middle: divorceMiddle,
      } = {},
    } = reportDivorce;
    const firstNameMatch = first?.toLowerCase() === divorceFirst?.toLowerCase();
    const lastNameMatch = last?.toLowerCase() === divorceLast?.toLowerCase();
    const middleNameMatch =
      middle?.toLowerCase() === divorceMiddle?.toLowerCase() ||
      (!middle && !divorceMiddle);

    const namesMatch = firstNameMatch && lastNameMatch && middleNameMatch;

    // Match by birthDate (formats: 'yyyy-MM-dd' in dependents, same in reportDivorce)
    const birthDatesMatch = dependentBirthDate === reportDivorceBirthDate;

    return namesMatch && birthDatesMatch;
  });

  // If we found a match, add the SSN (only if it's exactly 9 digits, normalized to digits only)
  if (matchingSpouse?.ssn && isValidSSN(matchingSpouse.ssn)) {
    return {
      ...data,
      reportDivorce: {
        ...reportDivorce,
        ssn: normalizeSSN(matchingSpouse.ssn),
      },
    };
  }

  return data;
}

/**
 * Initializes payload with required defaults for backend submission.
 *
 * @param {Object} form - Raw form data from the application
 * @returns {Object} Payload object with data property and defaults set
 */
function prepareSubmissionPayload(form) {
  const payload = cloneDeep(form);
  if (!payload.data) {
    payload.data = {};
  }
  payload.data.useV2 = true;
  payload.data.daysTillExpires = 365;
  return payload;
}

/**
 * Filters out data from inactive pages based on form configuration.
 *
 * IMPORTANT: Preserves critical wizard fields needed for page dependencies
 * during submission, even if their pages are marked inactive. This prevents
 * a cascade where removing view:addOrRemoveDependents causes all dependent
 * pages to become inactive and lose their data.
 *
 * @param {Object} formConfig - Form configuration object defining pages and structure
 * @param {Object} payload - Payload object with data property
 * @returns {Object} Payload object with inactive page data removed (but wizard fields preserved)
 */
function removeInactivePageData(formConfig, payload) {
  // Preserve wizard fields that are needed for page dependencies
  const wizardFields = {
    'view:addOrRemoveDependents': payload.data?.['view:addOrRemoveDependents'],
    'view:addDependentOptions': payload.data?.['view:addDependentOptions'],
    'view:removeDependentOptions':
      payload.data?.['view:removeDependentOptions'],
    'view:selectable686Options': payload.data?.['view:selectable686Options'],
  };

  const expandedPages = expandArrayPages(
    createFormPageList(formConfig),
    payload.data,
  );
  const activePages = getActivePages(expandedPages, payload.data);
  const inactivePages = getInactivePages(expandedPages, payload.data);

  const filtered = filterInactivePageData(inactivePages, activePages, payload);

  // CRITICAL: filterInactivePageData can return either:
  // - Payload structure: { data: {...}, ... }
  // - Data object directly: { field1: ..., field2: ..., ... }
  // We need to restore wizard fields to the correct location
  if (!filtered) {
    return payload;
  }

  // Check if filtered has a data property (payload structure) or is a data object directly
  const isPayloadStructure = filtered.data !== undefined;
  const dataObject = isPayloadStructure ? filtered.data : filtered;

  // Restore wizard fields if they were removed
  // (They may have been removed if their pages were marked inactive due to
  // depends functions that check for awarded dependents in V3 flow)
  Object.keys(wizardFields).forEach(key => {
    if (wizardFields[key] && !dataObject[key]) {
      dataObject[key] = wizardFields[key];
    }
  });

  return filtered;
}

/**
 * Extracts data object from payload for transformation functions.
 *
 * TYPE SAFETY NOTE:
 * filterInactivePageData returns a payload object { data: {...}, ... }
 * but transformPicklistToV2 and showV3Picklist expect a data object.
 *
 * This extraction ensures all functions receive the correct type and prevents
 * the bug where flags are set without corresponding data.
 *
 * @param {Object} payload - Payload object with data property
 * @returns {Object} Data object extracted from payload
 */
function extractDataFromPayload(payload) {
  return payload.data || payload;
}

/**
 * Transforms V3 picklist removal data to V2 format if V3 is enabled.
 *
 * @param {Object} data - Form data object
 * @returns {Object} Data object with V3 transformations applied (if applicable)
 */
function applyPicklistTransformations(data) {
  return showV3Picklist(data) ? transformPicklistToV2(data) : data;
}

/**
 * Enriches data with SSN from awarded dependents if needed.
 *
 * @param {Object} data - Form data object
 * @returns {Object} Data object with SSN enrichment applied
 */
function enrichDataWithSSN(data) {
  return enrichDivorceWithSSN(data);
}

/**
 * Rebuilds submission data with validated flags and wraps in payload structure.
 *
 * This is where submission flags are set based on actual data presence.
 * buildSubmissionData is the single source of truth for flags that go to backend.
 *
 * @param {Object} payload - Payload structure (without data property)
 * @param {Object} transformedData - Transformed form data
 * @returns {Object} Complete payload with validated submission flags
 */
function rebuildSubmissionPayload(payload, transformedData) {
  return buildSubmissionData({
    ...payload,
    data: transformedData,
  });
}

/**
 * Get form data for submission - main entry point for form submission.
 *
 * TRANSFORMATION PIPELINE:
 * 1. Prepare payload with defaults (useV2, daysTillExpires)
 * 2. Filter out data from inactive pages
 * 3. Extract data for transformation (type safety)
 * 4. Transform V3 picklist data to V2 format
 * 5. Enrich reportDivorce with SSN from awarded dependents
 * 6. Rebuild submission data with validated flags
 * 7. Extract data from payload structure for backend
 * 8. Serialize to JSON
 *
 * @param {Object} formConfig - Form configuration object defining structure
 * @param {Object} form - Raw form data from Redux store
 * @returns {Object} Object with body (JSON string) and data (cleaned payload)
 */
export function customTransformForSubmit(formConfig, form) {
  // Step 1: Initialize payload with required defaults
  const payload = prepareSubmissionPayload(form);

  // Step 2: Remove data from pages user didn't visit/complete
  const payloadWithoutInactivePages = removeInactivePageData(
    formConfig,
    payload,
  );

  // Step 3: Extract data for transformation (type safety)
  const dataToTransform = extractDataFromPayload(payloadWithoutInactivePages);

  // Step 4: Transform V3 picklist data to V2 format if needed
  const transformedData = applyPicklistTransformations(dataToTransform);

  // Step 5: Enrich reportDivorce with SSN from awarded dependents
  const enrichedData = enrichDataWithSSN(transformedData);

  // Step 6: Rebuild payload with validated flags (single source of truth)
  const finalPayload = rebuildSubmissionPayload(
    payloadWithoutInactivePages,
    enrichedData,
  );

  // Step 7: Extract the data from payload structure for backend submission
  // buildSubmissionData returns { data: cleanData, ...payload }
  // but backend expects just the cleanData without the wrapper
  const submissionData = finalPayload.data || finalPayload;

  // Step 8: Serialize to JSON for backend submission
  return {
    body: JSON.stringify(submissionData, customFormReplacer) || '{}',
    data: finalPayload || {},
  };
}
