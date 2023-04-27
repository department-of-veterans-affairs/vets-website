import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import VaCheckboxGroupField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxGroupField';
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

/**
 * @param {string | UISchemaOptions} [options]
 * @returns {UISchemaOptions}
 */
export const checkboxGroupUI = options => {
  const opts = typeof options === 'string' ? { 'ui:title': options } : options;

  return {
    'ui:title': 'Checkbox group',
    'ui:webComponentField': VaCheckboxGroupField,
    ...opts,
    ...opts.properties,
  };
};

/**
 * @param {SchemaOptions} [options]
 * @returns {SchemaOptions}
 */
export const checkboxGroupSchema = options => {
  return { type: 'object', ...options };
};
