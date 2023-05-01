import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';

/**
 * @param {string | UISchemaOptions} [options]
 * @returns {UISchemaOptions}
 */
export const selectUI = options => {
  const opts = typeof options === 'string' ? { 'ui:title': options } : options;
  return {
    'ui:title': 'Select',
    'ui:webComponentField': VaSelectField,
    'ui:options': {
      labels: {
        key: 'Key',
        ok: 'OK',
      },
    },
    ...opts,
  };
};

/**
 * @param {SchemaOptions} [options]
 * @returns {SchemaOptions}
 */
export const selectSchema = options => {
  return {
    type: 'object',
    properties: {
      selectDefault: {
        type: 'string',
        enum: ['key', 'ok'],
      },
    },
    ...options,
  };
};
