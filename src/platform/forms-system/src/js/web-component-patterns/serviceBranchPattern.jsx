import VaComboBoxField from '../web-component-fields/VaComboBoxField';

// remove the group property because opt groups don't work properly with va-combo-box
// see https://github.com/department-of-veterans-affairs/vets-design-system-documentation/issues/4971
// and https://github.com/department-of-veterans-affairs/vets-design-system-documentation/issues/4970
function removeGroups(labels) {
  const result = {};
  Object.keys(labels).forEach(key => {
    result[key] = { ...labels[key] };
    delete result[key].group;
  });
  return result;
}

const _ARMY_BRANCH_LABELS = {
  AAC: {
    label: 'Army Air Corps or Army Air Force',
    group: 'Army',
  },
  ARMY: { label: 'Army', group: 'Army' },
  AR: { label: 'Army Reserves', group: 'Army' },
  ARNG: { label: 'Army National Guard', group: 'Army' },
  WAC: { label: "Women's Army Corps", group: 'Army' },
};

export const ARMY_BRANCH_LABELS = removeGroups(_ARMY_BRANCH_LABELS);

const _NAVY_BRANCH_LABELS = {
  NAVY: { label: 'Navy', group: 'Navy' },
  NR: { label: 'Navy Reserves', group: 'Navy' },
  MM: { label: 'Merchant Marine', group: 'Navy' },
  MC: { label: 'Marine Corps', group: 'Navy' },
  MCR: { label: 'Marine Corps Reserves', group: 'Navy' },
  'N ACAD': { label: 'Naval Academy', group: 'Navy' },
};

export const NAVY_BRANCH_LABELS = removeGroups(_NAVY_BRANCH_LABELS);

const _AIR_FORCE_BRANCH_LABELS = {
  AF: { label: 'Air Force', group: 'Air Force' },
  AFR: { label: 'Air Force Reserves', group: 'Air Force' },
  ANG: { label: 'Air National Guard', group: 'Air Force' },
  'AF ACAD': { label: 'Air Force Academy', group: 'Air Force' },
};

export const AIR_FORCE_BRANCH_LABELS = removeGroups(_AIR_FORCE_BRANCH_LABELS);

const _SPACE_FORCE_BRANCH_LABELS = {
  SF: { label: 'Space Force', group: 'Space Force' },
};

export const SPACE_FORCE_BRANCH_LABELS = removeGroups(
  _SPACE_FORCE_BRANCH_LABELS,
);

const _COAST_GUARD_BRANCH_LABELS = {
  CG: { label: 'Coast Guard', group: 'Coast Guard' },
  CGR: { label: 'Coast Guard Reserves', group: 'Coast Guard' },
  'CG ACAD': { label: 'Coast Guard Academy', group: 'Coast Guard' },
};

export const COAST_GUARD_BRANCH_LABELS = removeGroups(
  _COAST_GUARD_BRANCH_LABELS,
);

const _OTHER_BRANCH_LABELS = {
  PHS: { label: 'Public Health Service', group: 'Other' },
  NOAA: {
    label: 'National Oceanic & Atmospheric Administration',
    group: 'Other',
  },
  USMA: { label: 'US Military Academy', group: 'Other' },
};

export const OTHER_BRANCH_LABELS = removeGroups(_OTHER_BRANCH_LABELS);

export const DEFAULT_BRANCH_LABELS = {
  ...ARMY_BRANCH_LABELS,
  ...NAVY_BRANCH_LABELS,
  ...AIR_FORCE_BRANCH_LABELS,
  ...SPACE_FORCE_BRANCH_LABELS,
  ...COAST_GUARD_BRANCH_LABELS,
  ...OTHER_BRANCH_LABELS,
};

/**
 * uiSchema for service branch field
 *
 * ```js
 * // uiSchema minimal
 * exampleServiceBranch: serviceBranchUI({required: () => true})
 *
 * // uiSchema full
 * exampleServiceBranch: serviceBranchUI({
 *  title: 'Please select your service branch',
 *  hint: 'Choose a branch of the armed forces',
 *  placeholder: 'Select a service branch',
 *  required: () => true,
 *  errorMessages: {
      required: 'You must select a service branch',
    },
 * })
 *
 * // schema:
 * // schema minimal
 * exampleServiceBranch: serviceBranchSchema()
 *
 * // schema with custom options
 * exampleServiceBranch: serviceBranchSchema([
 *   { value: "army", label: "Army" },
 *   { value: "air-force", label: "Air Force" }
 * ]})
 * 
 * // schema with option groups
 * exampleServiceBranch: serviceBranchSchema([
 *   { value: "army", label: "Army" },
 *   { value: "air-force", label: "Air Force" }
 *   { optiongroup: "oceanic", options: [
 *      { value: "marines", label: "Marines"},
 *      { value: "navy", label: "Navy" }
 *      { value: "coast guard", label: "Coast Guard" }
 *    ]}
 * ]})
 * ```
 *
 * @param {string | UIOptions & {
 *  title?: UISchemaOptions['ui:title'],
 *  errorMessages?: UISchemaOptions['ui:errorMessages'],
 *  required?: UISchemaOptions['ui:required'],
 *  labelHeaderLevel?: UISchemaOptions['ui:options']['labelHeaderLevel'],
 *  hint?: string,
 *  placeholder?: string,
 * }} options
 * @returns {UISchemaOptions}
 */
export const serviceBranchUI = options => {
  const { title, description, errorMessages, labels, required, ...uiOptions } =
    typeof options === 'object' ? options : { title: options };

  return {
    'ui:title': title || 'Select your service branch',
    'ui:description': description,
    'ui:webComponentField': VaComboBoxField,
    'ui:required': required,
    'ui:options': {
      ...uiOptions,
      labels: labels || DEFAULT_BRANCH_LABELS,
    },
    'ui:errorMessages': errorMessages,
  };
};

/**
 * schema for serviceBranchUI
 * ```js
 * exampleServiceBranch: serviceBranchSchema([{ value: 'AF', label: 'Air Force' }, { value: 'ARMY', label: 'Army' }])
 * exampleServiceBranch: serviceBranchSchema([
 * { optionGroup: 'Active Duty', options: [{ value: 'AF', label: 'Air Force' }, { value: 'ARMY', label: 'Army' }] },
 * { optionGroup: 'National Guard', options: [{ value: 'ANG', label: 'Air National Guard' }, { value: 'ARNG', label: 'Army National Guard' }]
 * }])
 * ```
 * @typedef {Object} ServiceBranch
 * @property {string} value the code for the branch
 * @property {string} label the display name for the branch
 * @typedef {Object} ServiceBranchOptionGroup
 * @property {string} optionGroup the label for the option group
 * @property {ServiceBranch[]} options the options in the group
 */

/**
 * @param {Object } [options]
 * @param {(ServiceBranch | ServiceBranchOptionGroup)[]} [options.branches]
 * @returns {SchemaOptions}
 */
export const serviceBranchSchema = labels => {
  return {
    type: 'string',
    enum: Array.isArray(labels) ? labels : Object.keys(DEFAULT_BRANCH_LABELS),
  };
};
