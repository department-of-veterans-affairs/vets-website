/**
 * Centralized data mappings for 686c-674 form workflows
 *
 * This file contains all mappings between workflow task keys and their
 * corresponding data fields. Used throughout the application for:
 * - Determining if a workflow is complete (has required data)
 * - Validating submissions before sending to backend
 * - Transforming V3 picklist data to V2 format
 */

/**
 * Maps workflow task keys to their required data fields.
 * Used by buildSubmissionData to determine if a workflow is complete.
 *
 * Structure:
 * - Key: Task key from TASK_KEYS constant
 * - Value: Array of form data field names that must have data
 */
export const ADD_WORKFLOW_MAPPINGS = {
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

export const REMOVE_WORKFLOW_MAPPINGS = {
  reportDivorce: ['reportDivorce'],
  reportDeath: ['deaths'],
  reportStepchildNotInHousehold: ['stepChildren'],
  reportMarriageOfChildUnder18: ['childMarriage'],
  reportChild18OrOlderIsNotAttendingSchool: ['childStoppedAttendingSchool'],
};

export const NO_SSN_REASON_PAYLOAD_MAPPINGS = {
  NONRESIDENT_ALIEN: 'Nonresident Alien',
  NONE_ASSIGNED: 'No SSN Assigned by SSA',
};

/**
 * V3 to V2 transformation routes.
 * Maps V3 removal reasons to V2 data arrays and transformation functions.
 *
 * Route types:
 * 1. Simple route: [arrayName, transformFn]
 * 2. Stepchild-aware route: [[defaultArray, defaultFn], [stepchildArray, stepchildFn]]
 */
export const V3_TRANSFORMATION_ROUTES = {
  // Deaths - all dependent types go to deaths array
  childDied: 'deaths',
  spouseDied: 'deaths',
  parentDied: 'deaths',

  // Child married - stepchildren go to stepChildren, others to childMarriage
  childMarried: {
    default: 'childMarriage',
    stepchild: 'stepChildren',
  },

  // Child not in school - stepchildren go to stepChildren, others to childStoppedAttendingSchool
  childNotInSchool: {
    default: 'childStoppedAttendingSchool',
    stepchild: 'stepChildren',
  },

  // Spouse divorce/annulment
  marriageEnded: 'reportDivorce',

  // Stepchild left household
  stepchildNotMember: 'stepChildren',

  // Child adopted
  childAdopted: 'stepChildren',

  // Parent other - not supported
  parentOther: null,
};

/**
 * Get the V2 destination array for a picklist item.
 * Handles both simple routes and stepchild-aware routes.
 *
 * @param {string} removalReason - V3 removal reason
 * @param {boolean} isStepchild - Whether the dependent is a stepchild
 * @returns {string|null} - V2 array name or null if unsupported
 */
export function getV2Destination(removalReason, isStepchild) {
  const route = V3_TRANSFORMATION_ROUTES[removalReason];

  if (route === undefined) {
    return undefined; // Unknown removal reason
  }

  if (route === null) {
    return null; // Unsupported removal reason
  }

  // Simple route (string)
  if (typeof route === 'string') {
    return route;
  }

  // Stepchild-aware route (object)
  return isStepchild ? route.stepchild : route.default;
}
