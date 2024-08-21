import VaCheckboxField from '~/platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import {
  currentOrPastDateRangeSchema,
  currentOrPastDateRangeUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

/**
 * Generates the uiSchema for a date range with a current checkbox.
 *
 * @param {Object} options - Options for the UI schema.
 * @param {string} options.fromLabel - Label for the start date.
 * @param {string} options.toLabel - Label for the end date.
 * @param {string} options.currentLabel - Label for the current checkbox.
 * @param {string} options.currentKey - Key for the current checkbox.
 * @param {function} options.isCurrentChecked - Function to determine if the current checkbox is checked.
 * @returns {UISchemaOptions} uiSchema - The UI schema for the date range with a current checkbox.
 */
export const dateRangeWithCurrentCheckboxUI = ({
  fromLabel,
  toLabel,
  currentLabel,
  currentKey,
  isCurrentChecked,
}) => ({
  dateRange: currentOrPastDateRangeUI(
    { title: fromLabel },
    {
      title: toLabel,
      hideIf: (formData, index) => isCurrentChecked(formData, index),
      required: (formData, index) => !isCurrentChecked(formData, index),
    },
  ),
  'view:currentToLabel': {
    'ui:description': toLabel,
    'ui:options': {
      hideIf: (formData, index) => !isCurrentChecked(formData, index),
    },
  },
  [currentKey]: {
    'ui:title': currentLabel,
    'ui:webComponentField': VaCheckboxField,
  },
});

/**
 * Generates the schema for a date range with a current checkbox.
 *
 * @param {string} currentKey - Key for the current checkbox.
 * @returns {Object} schema - The schema for the date range with a current checkbox.
 */
export const dateRangeWithCurrentCheckboxSchema = currentKey => ({
  dateRange: currentOrPastDateRangeSchema,
  'view:currentToLabel': {
    type: 'object',
    properties: {},
  },
  [currentKey]: {
    type: 'boolean',
  },
});
