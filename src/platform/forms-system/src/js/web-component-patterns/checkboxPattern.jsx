import VaCheckboxField from '../web-component-fields/VaCheckboxField';

export const checkboxSchema = {
  type: 'boolean',
};

export const checkboxRequiredSchema = {
  type: 'boolean',
  enum: [true],
};

/**
 * Web component v3 uiSchema for checkbox
 *
 * Usage uiSchema:
 * ```js
 * checkbox: checkboxUI('checkbox label)
 * checkbox: checkboxUI({
 *  title: 'Checkbox label',
 *  description: 'This goes above the checkbox',
 *  hint: 'This is a hint',
 *  errorMessages: {
 *   enum: 'Select the checkbox',
 *   required: 'Select the checkbox',
 *  },
 * ```
 *
 * Usage schema:
 * ```js
 * checkbox: checkboxRequiredSchema
 * checkbox: checkboxSchema
 * ```
 * @param {UIOptions & {
 *  title?: UISchemaOptions['ui:title'],
 *  description?: UISchemaOptions['ui:description'],
 *  hint?: string,
 *  tile?: boolean,
 *  required: (formData) => boolean,
 *  indeterminate?: boolean,
 *  checkboxDescription?: string,
 *  internalDescription?: React.ReactNode,
 *  marginTop?: string | number,
 *  errorMessages?: UISchemaOptions['ui:errorMessages'],
 * }} options
 * @returns {UISchemaOptions}
 */
export const checkboxUI = options => {
  const {
    title,
    description,
    required,
    validations,
    reviewField,
    confirmationField,
    errorMessages,
    replaceSchema,
    marginTop = 3,
    ...uiOptions
  } = typeof options === 'object' ? options : { title: options };

  let replaceSchemaOpt = replaceSchema;

  if (typeof required === 'function' && !replaceSchemaOpt) {
    // if required is dynamic, we also need to update the schema's `enum` dynamically
    replaceSchemaOpt = (formData, schema, uiSchema, index, path, fullData) => {
      const isRequired = required(formData, index, fullData);
      return isRequired ? { ...checkboxRequiredSchema } : { ...checkboxSchema };
    };
  }

  return {
    'ui:title': title,
    'ui:description': description,
    'ui:webComponentField': VaCheckboxField,
    'ui:errorMessages': {
      enum: errorMessages?.enum || errorMessages?.required,
      required: errorMessages?.required || errorMessages?.enum,
      ...errorMessages,
    },
    'ui:required': required,
    'ui:reviewField': reviewField,
    'ui:confirmationField': confirmationField,
    'ui:validations': validations,
    'ui:options': {
      classNames: marginTop ? `vads-u-margin-top--${marginTop}` : undefined,
      ...uiOptions,
      replaceSchema: replaceSchemaOpt,
      // Decision: Set this for checkboxUI, but not for VaCheckboxField
      // so it doesn't accidentally cause a regression for existing usages
      validateRequired: true,
    },
  };
};
