import { VaFileInputField } from '../web-component-fields';

export const filePresenceValidation = (
  errors,
  uploadedFile,
  _uiSchema,
  _schema,
  errorMessages,
) => {
  if (
    !(uploadedFile.confirmationCode && uploadedFile.name && uploadedFile.size)
  ) {
    errors.addError(errorMessages.required);
  }
};

/**
 * Web component v3 uiSchema for generic fileInput field
 *
 * Usage uiSchema:
 * ```js
 * exampleText: fileInputUI('Simple fileInput field')
 * exampleText: fileInputUI({
 *   title: 'FileInput field',
 *   hint: 'This is a hint',
 *   description: 'This is a description',
 *   charcount: true, // Used with minLength and maxLength in the schema
 * })
 * ```
 *
 * Usage schema:
 * ```js
 * exampleFileInput: fileInputSchema,
 * required: ['exampleFileInput']
 *
 * // or
 * exampleFileInput: {
 *   type: 'string',
 * }
 * ```
 *
 * About `labelHeaderLevel`:
 *
 * Simply use the label as the form header.
 *
 * About `useFormsPattern`:
 *
 * Advanced version of `labelHeaderLevel`.
 * Used with `formDescription`, `formHeading`, and `formHeadingLevel`
 * when the label of the field should be the actual form title and
 * have a description with JSX that should be read out by screen readers.
 *
 * @param {UIOptions & {
 *  title?: UISchemaOptions['ui:title'],
 *  description?: UISchemaOptions['ui:description'],
 *  hint?: UIOptions['hint'],
 *  errorMessages?: UISchemaOptions['ui:errorMessages'],
 *  labelHeaderLevel?: UIOptions['labelHeaderLevel'],
 *  messageAriaDescribedby?: UIOptions['messageAriaDescribedby'],
 *  useFormsPattern?: UIOptions['useFormsPattern'],
 *  formHeading?: UIOptions['formHeading'],
 *  formDescription?: UIOptions['formDescription'],
 *  formHeadingLevel?: UIOptions['formHeadingLevel'],
 * }} stringOrOptions
 * @returns {UISchemaOptions}
 */
export const fileInputUI = stringOrOptions => {
  if (typeof stringOrOptions === 'string') {
    return {
      'ui:title': stringOrOptions,
      'ui:webComponentField': VaFileInputField,
    };
  }

  const {
    title,
    description,
    errorMessages,
    required,
    reviewField,
    hidden,
    ...uiOptions
  } = stringOrOptions;

  return {
    'ui:title': title,
    'ui:description': description,
    'ui:required': required,
    'ui:webComponentField': VaFileInputField,
    'ui:reviewField': reviewField,
    'ui:hidden': hidden,
    'ui:validations': [
      (errors, data, formData, schema, errMessages) => {
        const isRequired =
          typeof required === 'function' ? required(formData) : required;
        if (isRequired) {
          filePresenceValidation(errors, data, formData, schema, errMessages);
        }
      },
    ],
    'ui:options': {
      ...uiOptions,
    },
    'ui:errorMessages': errorMessages,
  };
};

/**
 * Schema for generic fileInput field
 *
 * ```js
 * exampleFileInput: {
 *   type: 'object',
 * }
 * ```
 */
export const fileInputSchema = {
  type: 'object',
  properties: {
    confirmationCode: {
      type: 'string',
    },
    isEncrypted: {
      type: 'boolean',
    },
    name: {
      type: 'string',
    },
    size: {
      type: 'integer',
    },
    warnings: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
};
