import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import './schemaTypeDefs';

/**
 * @param {string | UISchemaOptions} [options]
 * @returns {UISchemaOptions}
 */
export const checkboxUI = options => {
  const opts = typeof options === 'string' ? { 'ui:title': options } : options;

  return {
    'ui:title': 'Checkbox',
    'ui:webComponentField': VaCheckboxField,
    ...opts,
  };
};

/**
 * @param {SchemaOptions} [options]
 * @returns {SchemaOptions}
 */
export const checkboxSchema = options => {
  return { type: 'boolean', ...options };
};
