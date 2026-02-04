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
  const branches = {};
  for (const [key, value] of Object.entries(DEFAULT_BRANCH_LABELS)) {
    if (value.group.toLowerCase() === group) {
      branches[key] = { ...value };
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
  return groups.reduce((acc, group) => {
    const clonedGroup = JSON.parse(JSON.stringify(BRANCHES[group]));
    return { ...acc, ...clonedGroup };
  }, {});
}

/**
 * @param {string[]} branches a list of keys for branches, e.g. the keys for the object in DEFAULT_BRANCH_LABELS
 * @returns an object with the key/value for each branch specified in the branches array.
 */
function getOptionsForBranches(branches) {
  const data = {};
  for (const branch of branches) {
    const clonedBranch = { ...DEFAULT_BRANCH_LABELS[branch] };
    data[branch] = clonedBranch;
  }
  return data;
}

/**
 * @param {ServiceBranchGroup} groups custom list of groups
 * @throws {Error} if one of the specified groups is invalid
 */
function checkGroups(groups) {
  groups.forEach(group => {
    if (!VALID_GROUPS.includes(group)) {
      throw new Error(`"${group}" is not a valid service branch group.`);
    }
  });
}

/**
 * @param {string[]} branches array of branch keys
 * @throws {Error} if one of the specified keys is invalid
 */
function checkBranches(branches) {
  const validKeys = new Set(Object.keys(DEFAULT_BRANCH_LABELS));
  branches.forEach(branch => {
    if (!validKeys.has(branch)) {
      throw new Error(`"${branch}" is not a valid service branch.`);
    }
  });
}

/**
 * @param {ServiceBranchGroup | string[]} options either user specified groups or branches
 * @param {boolean} groups is the option a group (if false then treat as array of branches)
 * @returns {boolean} true if a valid set of options false if none provided
 * @throws {Error} if options contains invalid group or invalid branch
 */
function checkOption(option, groups = true) {
  if (!option) return false;

  if (!Array.isArray(option)) {
    throw new Error(`${groups ? 'groups' : 'branches'} must be an array.`);
  }

  if (groups) {
    checkGroups(option);
  } else {
    checkBranches(option);
  }

  return true;
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
 * branchesExampleServiceBranch: serviceBranchUI({
 *  branches: ['AF', 'CG', 'PHS'],
 * })
 *
 * // schema:
 * // schema minimal
 * exampleServiceBranch: serviceBranchSchema()
 *
 * // schema with groups
 * exampleServiceBranch: serviceBranchSchema({ groups: ['army', 'navy'] })
 * 
 * // schema with branches
 * branchesExampleServiceBranch: serviceBranchSchema({ branches: ['AF', 'CG', 'PHS']})
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
  if (checkOption(groups)) {
    labels = getOptionsForGroups(groups);
  } else if (checkOption(branches, false)) {
    labels = getOptionsForBranches(branches);
  } else {
    labels = JSON.parse(JSON.stringify(DEFAULT_BRANCH_LABELS));
  }

  // don't render optgroups if only one group or for branches or if user sets optGroups = false
  if (!optGroups || (groups && groups.length === 1) || branches) {
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
 * exampleServiceBranch: serviceBranchSchema({ groups: ['army', 'navy'] })
 * ```
 */

/** @typedef {groups: ServiceBranchGroup, branches: string[] } SchemaInputOptions */

/**
 * @param {SchemaInpuOptions} [options] an object which may contain an array of valid groups or an array of valid branches
 * @returns {SchemaOptions}
 */
export const serviceBranchSchema = ({ branches, groups } = {}) => {
  let labels;
  if (checkOption(groups)) {
    labels = Object.keys(getOptionsForGroups(groups));
  } else if (checkOption(branches, false)) {
    labels = branches;
  } else {
    labels = Object.keys(DEFAULT_BRANCH_LABELS);
  }

  labels.sort((a, b) => {
    const { label: labelA } = DEFAULT_BRANCH_LABELS[a];
    const { label: labelB } = DEFAULT_BRANCH_LABELS[b];
    return labelA.localeCompare(labelB);
  });

  return {
    type: 'string',
    enum: labels,
  };
};
