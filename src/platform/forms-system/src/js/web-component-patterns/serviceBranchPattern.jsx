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
