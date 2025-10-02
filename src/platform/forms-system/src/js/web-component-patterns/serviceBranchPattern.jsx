import VaComboBoxField from '../web-component-fields/VaComboBoxField';
import { getEnum } from '../helpers';

const DEFAULT_BRANCHES = [
  { value: 'AAC', label: 'Army Air Corps or Army Air Force' },
  { value: 'AF ACAD', label: 'Air Force Academy' },
  { value: 'AF', label: 'Air Force' },
  { value: 'AFR', label: 'Air Force Reserves' },
  { value: 'ANG', label: 'Air National Guard' },
  { value: 'AR', label: 'Army Reserves' },
  { value: 'ARMY', label: 'Army' },
  { value: 'ARNG', label: 'Army National Guard' },
  { value: 'CG ACAD', label: 'Coast Guard Academy' },
  { value: 'CG', label: 'Coast Guard' },
  { value: 'CGR', label: 'Coast Guard Reserves' },
  { value: 'MC', label: 'Marine Corps' },
  { value: 'MCR', label: 'Marine Corps Reserves' },
  { value: 'MM', label: 'Merchant Marine' },
  { value: 'N ACAD', label: 'Naval Academy' },
  { value: 'NAVY', label: 'Navy' },
  {
    value: 'NOAA',
    label: 'National Oceanic & Atmospheric Administration',
  },
  { value: 'NR', label: 'Navy Reserves' },
  { value: 'OTH', label: 'Other' },
  { value: 'PHS', label: 'Public Health Service' },
  { value: 'SF', label: 'Space Force' },
  { value: 'USMA', label: 'US Military Academy' },
  { value: 'WAC', label: "Women's Army Corps" },
];

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
  const { title, description, errorMessages, required, ...uiOptions } =
    typeof options === 'object' ? options : { title: options };

  return {
    'ui:title': title || 'Select your service branch',
    'ui:description': description,
    'ui:webComponentField': VaComboBoxField,
    'ui:required': required,
    'ui:options': {
      ...uiOptions,
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
export const serviceBranchSchema = (options = {}) => {
  const { branches } = options;
  const _branches =
    Array.isArray(branches) && branches.length > 0
      ? branches
      : DEFAULT_BRANCHES;
  return {
    type: 'string',
    enum: getEnum(_branches),
    _options: _branches,
    ...options,
  };
};
