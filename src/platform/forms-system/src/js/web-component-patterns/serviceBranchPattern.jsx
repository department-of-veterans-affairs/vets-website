import VaComboBoxField from '../web-component-fields/VaComboBoxField';

export const ARMY_BRANCH_LABELS = {
  AAC: {
    label: 'Army Air Corps or Army Air Force',
    group: 'Army',
  },
  ARMY: { label: 'Army', group: 'Army' },
  AR: { label: 'Army Reserves', group: 'Army' },
  ARNG: { label: 'Army National Guard', group: 'Army' },
  WAC: { label: "Women's Army Corps", group: 'Army' },
  PA: { label: 'Philippine Air Force', group: 'Army' },
};

export const NAVY_BRANCH_LABELS = {
  NAVY: { label: 'Navy', group: 'Navy' },
  NR: { label: 'Navy Reserves', group: 'Navy' },
  MM: { label: 'Merchant Marine', group: 'Navy' },
  MC: { label: 'Marine Corps', group: 'Navy' },
  MCR: { label: 'Marine Corps Reserves', group: 'Navy' },
  'N ACAD': { label: 'Naval Academy', group: 'Navy' },
  PN: { label: 'Philippine Navy', group: 'Navy' },
};

export const AIR_FORCE_BRANCH_LABELS = {
  AF: { label: 'Air Force', group: 'Air Force' },
  AFR: { label: 'Air Force Reserves', group: 'Air Force' },
  ANG: { label: 'Air National Guard', group: 'Air Force' },
  'AF ACAD': { label: 'Air Force Academy', group: 'Air Force' },
  PAF: { label: 'Philippine Air Force', group: 'Air Force' },
};

export const SPACE_FORCE_BRANCH_LABELS = {
  SF: { label: 'Space Force', group: 'Space Force' },
};

export const COAST_GUARD_BRANCH_LABELS = {
  CG: { label: 'Coast Guard', group: 'Coast Guard' },
  CGR: { label: 'Coast Guard Reserves', group: 'Coast Guard' },
  'CG ACAD': { label: 'Coast Guard Academy', group: 'Coast Guard' },
};

export const OTHER_BRANCH_LABELS = {
  PHS: { label: 'Public Health Service (USPHS)', group: 'Other' },
  NOAA: {
    label: 'National Oceanic & Atmospheric Administration',
    group: 'Other',
  },
  USMA: { label: 'US Military Academy', group: 'Other' },
};

export const DEFAULT_BRANCH_LABELS = {
  ...ARMY_BRANCH_LABELS,
  ...NAVY_BRANCH_LABELS,
  ...AIR_FORCE_BRANCH_LABELS,
  ...SPACE_FORCE_BRANCH_LABELS,
  ...COAST_GUARD_BRANCH_LABELS,
  ...OTHER_BRANCH_LABELS,
};

const BRANCHES = {
  army: ARMY_BRANCH_LABELS,
  navy: NAVY_BRANCH_LABELS,
  'air force': AIR_FORCE_BRANCH_LABELS,
  'coast guard': COAST_GUARD_BRANCH_LABELS,
  'space force': SPACE_FORCE_BRANCH_LABELS,
  other: OTHER_BRANCH_LABELS,
};

/**
 * @param {string[]} groups the groups to include
 * @returns { Object } an object with the key/value for each option in a subset of valid groups
 */
function getOptionsForGroups(groups) {
  const validGroups = Object.keys(BRANCHES);

  const selectedGroups = groups.filter(group => validGroups.includes(group));
  if (selectedGroups.length === 0) {
    throw new Error('Not a valid Service Branch group');
  }

  return selectedGroups.reduce((acc, group) => {
    return Object.assign(acc, BRANCHES[group]);
  }, {});
}

/**
 * uiSchema for service branch field
 *
 * ```js
 * // uiSchema minimal
 * exampleServiceBranch: serviceBranchUI()
 *
 * // uiSchema full
 * exampleServiceBranch: serviceBranchUI({
 *  title: 'Please select your service branch',
 *  hint: 'Choose a branch of the armed forces',
 *  placeholder: 'Select a service branch',
 *  required: () => true,
 *  groups: ['army', 'navy'],
 *  errorMessages: {
      required: 'You must select a service branch',
    },
 * })
 *
 * // schema:
 * // schema minimal
 * exampleServiceBranch: serviceBranchSchema()
 *
 * // schema with groups
 * exampleServiceBranch: serviceBranchSchema(['army', 'navy'])
 * ```
 *
 * @param {string | UIOptions & {
 *  title?: UISchemaOptions['ui:title'],
 *  errorMessages?: UISchemaOptions['ui:errorMessages'],
 *  required?: UISchemaOptions['ui:required'],
 *  labelHeaderLevel?: UISchemaOptions['ui:options']['labelHeaderLevel'],
 *  hint?: string,
 *  placeholder?: string,
 *  groups?: string[]
 * }} options
 * @returns {UISchemaOptions}
 */
export const serviceBranchUI = options => {
  const { title, description, errorMessages, groups, required, ...uiOptions } =
    typeof options === 'object' ? options : { title: options };

  const labels = Array.isArray(groups)
    ? getOptionsForGroups(groups)
    : DEFAULT_BRANCH_LABELS;

  return {
    'ui:title': title || 'Select your service branch',
    'ui:description': description,
    'ui:webComponentField': VaComboBoxField,
    'ui:required': required,
    'ui:options': {
      ...uiOptions,
      labels,
    },
    'ui:errorMessages': {
      required: 'Select a branch',
      ...errorMessages,
    },
  };
};

/**
 * schema for serviceBranchUI
 * ```js
 * exampleServiceBranch: serviceBranchSchema()
 * exampleServiceBranch: serviceBranchSchema(['army', 'navy'])
 * ```
 */

/**
 * @param {Array<string> } [groups] an array of valid groups, i.e. the keys in BRANCHES
 * @returns {SchemaOptions}
 */
export const serviceBranchSchema = groups => {
  const labels = groups
    ? Object.keys(getOptionsForGroups(groups))
    : Object.keys(DEFAULT_BRANCH_LABELS);

  return {
    type: 'string',
    enum: labels,
  };
};
