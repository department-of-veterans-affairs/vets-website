import VaCheckboxField from '~/platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import {
  currentOrPastMonthYearDateRangeSchema,
  currentOrPastMonthYearDateRangeUI,
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
  dateRange: currentOrPastMonthYearDateRangeUI(
    {
      title: fromLabel,
      hint: 'For example: January 2000',
    },
    {
      title: toLabel,
      hint: 'For example: January 2000',
      hideIf: (formData, index, fullData) =>
        isCurrentChecked(formData, index, fullData),
      required: (formData, index, fullData) =>
        !isCurrentChecked(formData, index, fullData),
    },
  ),
  // TODO: At somepoint we should update this so that the checkbox is before the to date for accessibility.
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
  dateRange: {
    ...currentOrPastMonthYearDateRangeSchema,
    required: ['from'],
  },
  'view:currentToLabel': {
    type: 'object',
    properties: {},
  },
  [currentKey]: {
    type: 'boolean',
  },
});
