/* eslint-disable no-console */
import React from 'react';
import { validateBooleanGroup } from '../validation';
import VaCheckboxGroupField from '../web-component-fields/VaCheckboxGroupField';

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
 * uiSchema for checkbox group. Includes title and labels.
 *
 * Usage uiSchema:
 * ```js
 * checkboxGroup: checkboxGroupUI({
 *    title: 'Checkbox group',
 *    required: true,
 *    labels: {
 *      hasA: 'Option A',
 *      hasB: 'Option B',
 *    },
 *  })
 * ```
 *
 * ```js
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
 * ```
 *
 * Usage schema:
 * ```js
 * checkboxGroup: checkboxGroupSchema(['hasA', 'hasB'])
 * ```
 * @param {UIOptions & {
 *  title?: UISchemaOptions['ui:title'],
 *  required: boolean | ((formData) => boolean),
 *  labels: Record<string, string | UISchemaOptions>,
 *  description?: UISchemaOptions['ui:description'],
 *  tile?: boolean,
 *  errorMessages?: UISchemaOptions['ui:errorMessages'],
 *  labelHeaderLevel?: UISchemaOptions['ui:options']['labelHeaderLevel'],
 *  hint?: string,
 * }} options
 * @returns {UISchemaOptions}
 */
export const checkboxGroupUI = ({
  title,
  description,
  errorMessages,
  labels,
  required,
  ...uiOptions
}) => {
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
    'ui:confirmationField': ({ formData }) => {
      if (!formData) {
        return null;
      }
      const selected = Object.entries(formData)
        // eslint-disable-next-line no-unused-vars
        .filter(([key, value]) => value)
        .map(([key]) => labels[key]?.title || labels[key]);

      let data = null;
      if (selected.length === 1) {
        [data] = selected;
      } else if (selected.length > 1) {
        data = (
          <ul>
            {selected.map((label, i) => (
              <li key={i}>{label}</li>
            ))}
          </ul>
        );
      }
      return {
        data,
      };
    },
    'ui:options': {
      ...uiOptions,
    },
    'ui:required': typeof required === 'function' ? required : () => required,
    ...checkboxesUI,
  };
};

/**
 * schema for checkboxGroupUI
 *
 * ```js
 * checkboxGroup: checkboxGroupSchema(['hasA', 'hasB'])
 * checkboxGroup: checkboxGroupSchema(['none', 'email', 'mobile', 'home', 'all'])
 * ```
 * @param {string[]} labels
 * @returns {SchemaOptions}
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
