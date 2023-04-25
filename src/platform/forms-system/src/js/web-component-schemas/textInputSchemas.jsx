import { uiSchema as emailUIDefinition } from 'platform/forms-system/src/js/definitions/email';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import VaTextInputField from '../web-component-fields/VaTextInputField';
import './schemaTypeDefs';

/**
 * @param {string | UISchemaOptions} [options]
 * @returns {UISchemaOptions}
 */
export const textInputUI = options => {
  const opts = typeof options === 'string' ? { 'ui:title': options } : options;
  return {
    'ui:title': 'Text',
    'ui:webComponentField': VaTextInputField,
    ...opts,
  };
};

/**
 * @param {SchemaOptions} [options] schema partial
 * @returns {SchemaOptions} schema
 */
export const textInputSchema = options => {
  return { type: 'string', ...options };
};

/**
 * @param {string | UISchemaOptions} [options]
 * @returns {UISchemaOptions}
 */
export const emailUI = options => {
  const opts = typeof options === 'string' ? { 'ui:title': options } : options;

  return {
    ...emailUIDefinition(opts['ui:title']),
    'ui:webComponentField': VaTextInputField,
    ...opts,
  };
};

/**
 * @param {SchemaOptions} [options] schema partial
 * @returns {SchemaOptions} schema
 */
export const emailSchema = options => {
  return options
    ? { ...commonDefinitions.email, ...options }
    : commonDefinitions.email;
};
