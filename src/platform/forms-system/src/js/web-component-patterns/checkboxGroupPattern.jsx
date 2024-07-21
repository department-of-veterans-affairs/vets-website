/* eslint-disable no-console */
import { validateBooleanGroup } from '../validation';
import VaCheckboxGroupField from '../web-component-fields/VaCheckboxGroupField';

/**
 * @typedef {Object} CheckboxGroupUIOptions
 * @property {UITitle} title
 * @property {Record<string, string | UISchemaOptions>} labels
 * @property {UIRequired} required
 * @property {UIDescription} [description]
 * @property {UIErrorMessages} [errorMessages]
 * @property {UITile} [tile]
 * @property {UILabelHeaderLevel} [labelHeaderLevel]
 * @property {UIHint} [hint]
 */

/**
 * @module CheckboxPatterns
 */

/**
 * @param {WebComponentFieldProps} props
 */
const checkboxGroupItemUI = props => {
  const { title, description, ...uiOptions } =
    typeof props === 'object' ? props : { title: props };
  return {
    'ui:title': title,
    'ui:description': description,
    'ui:options': {
      ...uiOptions,
    },
  };
};

/**
 * @description Web component v3 uiSchema for checkbox group
 *
 * @example
 * checkboxGroup: checkboxGroupUI({
 *    title: 'Checkbox group',
 *    required: true,
 *    labels: {
 *      hasA: 'Option A',
 *      hasB: 'Option B',
 *    },
 *  })
 *
 * @example
 * checkboxGroup: checkboxGroupUI({
 *    title: 'Checkbox group',
 *    hint: 'This is a hint',
 *    required: false,
 *    description: 'Please select at least one option',
 *    labelHeaderLevel: '3',
 *    tile: true,
 *    labels: {
 *      hasA: {
 *        title: 'Option A',
 *        description: 'Select this option if you want to do option A',
 *      },
 *      hasB: {
 *        title: 'Option B',
 *        description: 'Select this option if you want to do option B',
 *      },
 *    },
 *    errorMessages: {
 *       required: 'Please select at least one option',
 *    },
 *    validations: [validateBooleanGroup],
 *  })
 *
 * @example
 * // Use this if you need JSX description to be read by screen readers
 * exampleRadio: radioUI({
 *   title: 'Checkbox group',
 *   required: true, // also need required in the schema
 *   useFormsPattern: 'single',
 *   formHeading: 'Form page title',
 *   formHeadingLevel: 3,
 *   formDescription: (<p>This is a description</p>)
 * })
 *
 * @example
 * // Usage schema:
 * checkboxGroup: checkboxGroupSchema(['hasA', 'hasB'])
 *
 * @param {UIOptions & CheckboxGroupUIOptions} options
 * @returns {UISchemaOptions}
 */
export function checkboxGroupUI({
  title,
  description,
  errorMessages,
  labels,
  required,
  ...uiOptions
}) {
  if (required === undefined) {
    throw new Error(
      `"required" property should be explicitly set for checkboxGroupUI for
      title: "${title}". Please set "required" to a boolean, or a function
      that returns a boolean. Also you will still need to set required in
      the schema as well.`,
    );
  }
  if (!labels) {
    throw new Error(
      `"labels" is required for checkboxGroupUI. "labels" is an object with keys
      that match the schema properties, and values that are the checkbox labels
      (strings or objects with title and description)`,
    );
  }

  const checkboxesUI = {};
  Object.entries(labels).forEach(([key, checkboxProps]) => {
    checkboxesUI[key] = checkboxGroupItemUI(checkboxProps);
  });

  return {
    'ui:title': title,
    'ui:description': description,
    'ui:webComponentField': VaCheckboxGroupField,
    'ui:errorMessages': {
      atLeastOne:
        errorMessages?.atLeastOne ||
        errorMessages?.required ||
        'Please select at least one option',
    },
    'ui:validations': [
      (errors, data, formData, schema, errMessages) => {
        const isRequired =
          typeof required === 'function' ? required(formData) : required;
        if (isRequired) {
          validateBooleanGroup(errors, data, formData, schema, errMessages);
        }
      },
    ],
    'ui:options': {
      ...uiOptions,
    },
    'ui:required': typeof required === 'function' ? required : () => required,
    ...checkboxesUI,
  };
}

/**
 * @example
 * checkboxGroup: checkboxGroupSchema(['hasA', 'hasB'])
 * checkboxGroup: checkboxGroupSchema(['none', 'email', 'mobile', 'home', 'all'])
 * @param {string[]} labels
 * @returns {SchemaOptions}
 * @function
 */
export const checkboxGroupSchema = labels => {
  const properties = {};
  labels.forEach(label => {
    properties[label] = { type: 'boolean' };
  });

  return {
    type: 'object',
    properties,
  };
};
