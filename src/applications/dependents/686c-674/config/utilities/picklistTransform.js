import { dataDogLogger } from 'platform/monitoring/Datadog/utilities';

import { PICKLIST_DATA } from '../constants';
import { getV2Destination } from '../dataMappings';

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
      // assume disabled if over 24, we'll add a specific question later
      // childOver18InSchool: true, // Can't assume this
      disabled: item.age > 24,
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
    const supportingStepchild = item.stepchildFinancialSupport === 'Y';
    return {
      ...baseData,
      dateStepchildLeftHousehold: item.endDate,
      whoDoesTheStepchildLiveWith: item.whoDoesTheStepchildLiveWith || {},
      address: item.address || {},
      livingExpensesPaid: supportingStepchild
        ? 'More than half'
        : 'Less than half',
      supportingStepchild,
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

  selected.forEach(item => {
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
