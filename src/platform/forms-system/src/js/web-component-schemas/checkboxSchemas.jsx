import VaCheckboxGroupField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxGroupField';

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
