import VaSelectField from '../web-component-fields/VaSelectField';

/**
 * uiSchema for generic select field
 *
 * ```js
 * // Simple usage
 * exampleSelect: selectUI('Select animal')
 * exampleSelect: selectUI({
 *  title: 'Select animal',
 *  hint: 'This is a hint',
 * })
 *
 * // schema:
 * exampleSelect: selectSchema(['Cat', 'Dog', 'Octopus'])
 *
 * // With key/value labels:
 * exampleSelect: selectUI({
 *  title: 'Select animal',
 *  labels: {
 *    cat: 'Cat',
 *    dog: 'Dog',
 *    octopus: 'Octopus',
 *  },
 *  errorMessages: {
 *     required: 'Please select an animal',
 *  },
 * })
 *
 * // schema
 * exampleSelect: selectSchema(['cat', 'dog', 'octopus'])
 *
 * // With grouped options (optgroups):
 * branchOfService: selectUI({
 *  title: 'Branch of Service',
 *  hint: 'Select your branch of service',
 *  labels: {
 *    'Branches of Service': {
 *      navy: 'Navy',
 *      army: 'Army',
 *      marines: 'Marines',
 *      airForce: 'Air Force',
 *      coastguard: 'Coastguard'
 *    },
 *    'Other': {
 *      other: 'Other'
 *    }
 *  },
 *  errorMessages: {
 *    required: 'Please select your branch of service'
 *  }
 * })
 *
 * // schema (same as flat)
 * branchOfService: selectSchema(['navy', 'army', 'marines', 'airForce', 'coastguard', 'other'])
 * ```
 *
 * @param {string | UIOptions & {
 *  title?: UISchemaOptions['ui:title'],
 *  errorMessages?: UISchemaOptions['ui:errorMessages'],
 *  required?: UISchemaOptions['ui:required'],
 *  labelHeaderLevel?: UISchemaOptions['ui:options']['labelHeaderLevel'],
 *  hint?: string,
 *  labels?: UISchemaOptions['ui:options']['labels'] | Record<string, Record<string, string>>,
 * }} options
 * @returns {UISchemaOptions}
 */
export const selectUI = options => {
  const { title, description, errorMessages, required, ...uiOptions } =
    typeof options === 'object' ? options : { title: options };

  return {
    'ui:title': title,
    'ui:description': description,
    'ui:webComponentField': VaSelectField,
    'ui:required': required,
    'ui:options': {
      ...uiOptions,
    },
    'ui:errorMessages': errorMessages,
  };
};

/**
 * schema for selectUI
 * ```js
 * exampleSelect: selectSchema(['Cat', 'Dog', 'Octopus'])
 * exampleSelect: selectSchema(['cat', 'dog', 'octopus'])
 * ```
 * @param {string[]} labels
 * @returns {SchemaOptions}
 */
export const selectSchema = labels => {
  return {
    type: 'string',
    enum: labels,
  };
};
