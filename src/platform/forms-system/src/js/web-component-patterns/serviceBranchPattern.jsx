import VaComboBoxField from '../web-component-fields/VaComboBoxField';
import DEFAULT_BRANCH_LABELS from './content/serviceBranch.json';

/** @typedef {'army' | 'navy' | 'marine corps' | 'air force' | 'coast guard' | 'space force' | 'other'} ServiceBranchGroup */

const VALID_GROUPS = Object.values(DEFAULT_BRANCH_LABELS).map(({ group }) =>
  group.toLowerCase(),
);

/**
 * @param {ServiceBranchGroup} group
 * @returns { Object } branches within a group
 */
export function getServiceBranchesByGroup(group) {
  if (!VALID_GROUPS.includes(group)) {
    throw new Error('This is an invalid group.');
  }
  const branches = {};
  for (const [key, value] of Object.entries(DEFAULT_BRANCH_LABELS)) {
    if (value.group.toLowerCase() === group) {
      branches[key] = value;
    }
  }
  return branches;
}

// object with key (a group) and value (object containing the branches for that group)
const BRANCHES = {};
VALID_GROUPS.forEach(group => {
  BRANCHES[group] = getServiceBranchesByGroup(group);
});

/**
 * @param {string[]} groups the groups to include
 * @returns { Object } an object with the key/value for each option in a subset of valid groups
 */
function getOptionsForGroups(groups) {
  const selectedGroups = groups.filter(group => VALID_GROUPS.includes(group));
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
 * @param {string[]} branches a list of keys for branches, e.g. the keys for the object in DEFAULT_BRANCH_LABELS
 * @returns an object with the key/value for each branch specified in the branches array.
 */
function getOptionsForBranches(branches) {
  const keys = Object.keys(DEFAULT_BRANCH_LABELS);
  const data = {};
  for (const branch of branches) {
    if (!keys.includes(branch)) {
      throw new Error(
        'This key does not correspond to a valid service branch.',
      );
    }
    data[branch] = DEFAULT_BRANCH_LABELS[branch];
  }
  return data;
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
 * // uiSchema with branches specified
 * branchesExampleServiceBranch({
 *  branches: ['AF', 'CG', 'PHS'],
 * })
 *
 * // schema:
 * // schema minimal
 * exampleServiceBranch: serviceBranchSchema()
 *
 * // schema with groups
 * exampleServiceBranch: serviceBranchSchema(['army', 'navy'])
 * 
 * // schema with branches
 * branchesExampleServiceBranch: serviceBranchSchema(['AF', 'CG', 'PHS'])
 * ```
 *
 * @param {string | UIOptions & {
 *  title?: UISchemaOptions['ui:title'],
 *  errorMessages?: UISchemaOptions['ui:errorMessages'],
 *  required?: UISchemaOptions['ui:required'],
 *  labelHeaderLevel?: UISchemaOptions['ui:options']['labelHeaderLevel'],
 *  hint?: string,
 *  placeholder?: string,
 *  groups?: ServiceBranchGroup[],
 *  branches?: string[],
 *  optGroups?: boolean,
 * }} options
 * @returns {UISchemaOptions}
 */
export const serviceBranchUI = options => {
  const {
    title,
    description,
    errorMessages,
    groups,
    branches,
    optGroups = true,
    required,
    ...uiOptions
  } = typeof options === 'object' ? options : { title: options };

  let labels;
  if (branches && Array.isArray(branches)) {
    labels = getOptionsForBranches(branches);
  } else if (groups && Array.isArray(groups)) {
    labels = getOptionsForGroups(groups);
  } else {
    labels = DEFAULT_BRANCH_LABELS;
  }

  // don't show optgroups if individual branches are specified
  if (!optGroups || branches) {
    Object.keys(labels).forEach(key => {
      delete labels[key].group;
    });
  }

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
export const serviceBranchSchema = options => {
  // check if this pattern instance specified groups
  const isGroupArray =
    Array.isArray(options) &&
    options.every(option => VALID_GROUPS.includes(option));

  // check if this pattern instance specified an array of branches taken from across groups
  const isBranchArray =
    !isGroupArray &&
    Array.isArray(options) &&
    options.every(option =>
      Object.keys(DEFAULT_BRANCH_LABELS).includes(option),
    );

  let labels;
  if (isGroupArray) {
    labels = Object.keys(getOptionsForGroups(options));
  } else if (isBranchArray) {
    labels = options;
  } else {
    labels = Object.keys(DEFAULT_BRANCH_LABELS);
  }

  return {
    type: 'string',
    enum: labels,
  };
};
