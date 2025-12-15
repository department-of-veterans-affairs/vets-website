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
  PA: { label: 'Philippine Army', group: 'Army' },
};

export const NAVY_BRANCH_LABELS = {
  NAVY: { label: 'Navy', group: 'Navy' },
  NR: { label: 'Navy Reserves', group: 'Navy' },
  'N ACAD': { label: 'Naval Academy', group: 'Navy' },
  PN: { label: 'Philippine Navy', group: 'Navy' },
};

export const MARINE_BRANCH_LABELS = {
  MC: { label: 'Marine Corps', group: 'Marine Corps' },
  MCR: { label: 'Marine Corps Reserves', group: 'Marine Corps' },
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
  MM: { label: 'Merchant Marine', group: 'Other' },
};

export const DEFAULT_BRANCH_LABELS = {
  ...ARMY_BRANCH_LABELS,
  ...NAVY_BRANCH_LABELS,
  ...MARINE_BRANCH_LABELS,
  ...AIR_FORCE_BRANCH_LABELS,
  ...SPACE_FORCE_BRANCH_LABELS,
  ...COAST_GUARD_BRANCH_LABELS,
  ...OTHER_BRANCH_LABELS,
};

const BRANCHES = {
  army: ARMY_BRANCH_LABELS,
  navy: NAVY_BRANCH_LABELS,
  'marine corps': MARINE_BRANCH_LABELS,
  'air force': AIR_FORCE_BRANCH_LABELS,
  'coast guard': COAST_GUARD_BRANCH_LABELS,
  'space force': SPACE_FORCE_BRANCH_LABELS,
  other: OTHER_BRANCH_LABELS,
};

/** @typedef {'army' | 'navy' | 'marine corps' | 'air force' | 'coast guard' | 'space force' | 'other'} ServiceBranchGroup */

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

  const options = selectedGroups.reduce((acc, group) => {
    return Object.assign(acc, BRANCHES[group]);
  }, {});

  // if there is only a single group remove the group property from each option so we don't render a redundant option group label
  if (groups.length === 1) {
    Object.keys(options).forEach(key => {
      delete options[key].group;
    });
  }

  return options;
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
 *  groups?: ServiceBranchGroup[]
 * }} options
 * @returns {UISchemaOptions}
 */
export const serviceBranchUI = options => {
  const { title, description, errorMessages, groups, required, ...uiOptions } =
    typeof options === 'object' ? options : { title: options };

  const labels = Array.isArray(groups)
    ? getOptionsForGroups(groups)
    : DEFAULT_BRANCH_LABELS;

  // disable optgroups until bug in va-combo-box resolved. see https://github.com/orgs/department-of-veterans-affairs/projects/1643/views/1?filterQuery=+-category%3A%22Experimental+Design%22%2CEpic%2CInitiative+va-combo-box&pane=issue&itemId=136499540&issue=department-of-veterans-affairs%7Cvets-design-system-documentation%7C5113
  Object.keys(labels).forEach(key => {
    delete labels[key].group;
  });

  const _title = title || 'Select your service branch';

  return {
    'ui:title': _title,
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
    'ui:confirmationField': ({ formData }) => ({
      data: formData.label,
      label: _title,
    }),
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
 * @param {ServiceBranchGroup[]} [groups] an array of valid groups, i.e. the keys in BRANCHES
 * @returns {SchemaOptions}
 */
export const serviceBranchSchema = groups => {
  // const labels = groups
  //   ? Object.keys(getOptionsForGroups(groups))
  //   : Object.keys(DEFAULT_BRANCH_LABELS);

  // get the keys alphabetically sorted by their associated label
  // remove this code when bug in va-combo-box resolved. see https://github.com/orgs/department-of-veterans-affairs/projects/1643/views/1?filterQuery=+-category%3A%22Experimental+Design%22%2CEpic%2CInitiative+va-combo-box&pane=issue&itemId=136499540&issue=department-of-veterans-affairs%7Cvets-design-system-documentation%7C5113
  const labels = Object.entries(
    groups ? getOptionsForGroups(groups) : DEFAULT_BRANCH_LABELS,
  )
    .sort((a, b) => a[1].label.localeCompare(b[1].label))
    .map(branch => branch[0]);
  return {
    type: 'string',
    enum: labels,
  };
};
