import React from 'react';
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
 * uiSchema for file input field
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
 * exampleFileInput: fileInputSchema(),
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
 * }} options
 * @returns {UISchemaOptions}
 */
export const fileInputUI = options => {
  const { title, description, errorMessages, required, ...uiOptions } = options;

  if (required === undefined) {
    throw new Error(
      `"required" property should be explicitly set for fileInputUI for
      title: "${title}". Please set "required" to a boolean, or a function
      that returns a boolean. Also you will still need to set required in
      the schema as well.`,
    );
  }

  return {
    'ui:title': title,
    'ui:description': description,
    'ui:webComponentField': VaFileInputField,
    'ui:required': typeof required === 'function' ? required : () => !!required,
    'ui:errorMessages': {
      required: 'A file is required to submit your application',
      ...errorMessages,
    },
    'ui:validations': [
      (errors, data, formData, schema, uiErrorMessages) => {
        const isRequired =
          typeof required === 'function' ? required(formData) : !!required;
        if (isRequired) {
          filePresenceValidation(
            errors,
            data,
            formData,
            schema,
            uiErrorMessages,
          );
        }
      },
    ],
    'ui:options': {
      ...uiOptions,
    },
    'ui:reviewField': ({ children }) => (
      <div className="review-row">
        <dt>{title}</dt>
        <dd>{children.props?.formData?.name}</dd>
      </div>
    ),
    'ui:confirmationField': ({ formData }) => ({
      data: formData?.name,
      label: title,
    }),
    warnings: {
      'ui:options': {
        keepInPageOnReview: true,
      },
    },
  };
};

/**
 * Schema for fileInputUI
 *
 * ```js
 * exampleFileInput: fileInputSchema()
 * ```
 */
export const fileInputSchema = () => ({
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
    fileType: {
      type: 'string',
    },
    warnings: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
});
