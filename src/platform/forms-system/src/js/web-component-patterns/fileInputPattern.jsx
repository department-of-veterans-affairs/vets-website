import React from 'react';
import PropTypes from 'prop-types';
import {
  VaFileInputField,
  VaFileInputMultipleField,
} from '../web-component-fields';
import { getFileSize } from '../web-component-fields/vaFileInputFieldHelpers';

const ReviewFieldPropTypes = {
  children: PropTypes.node,
  formData: PropTypes.any,
};

function fileInputReviewField({ children }, title) {
  fileInputReviewField.propTypes = ReviewFieldPropTypes;
  return (
    <div className="review-row">
      <dt>{title}</dt>
      <dd>{children.props?.formData?.name}</dd>
    </div>
  );
}
function fileInputMultipleReviewField({ children }) {
  fileInputMultipleReviewField.propTypes = ReviewFieldPropTypes;
  return (
    <>
      {children?.props?.formData.map(item => (
        <div
          key={`${item?.confirmationCode}-${item?.lastModified}`}
          className="review-row"
        >
          <dt>{item.name}</dt>
          <dd>{getFileSize(item?.size)}</dd>
        </div>
      ))}
    </>
  );
}

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
    'ui:reviewField': props => fileInputReviewField(props, title),
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
 * Web component v3 uiSchema for generic fileInputMultiple field
 *
 * Usage uiSchema:
 * ```js
 * exampleText: fileInputMultipleUI('Simple fileInput field')
 * exampleText: fileInputMultipleUI({
 *   title: 'FileInput field',
 *   hint: 'This is a hint',
 * })
 * ```
 *
 * Usage schema:
 * ```js
 * exampleFileInput: fileInputMultipleSchema,
 * required: ['exampleFileInput']
 *
 * About `labelHeaderLevel`:
 *
 * Advanced version of `labelHeaderLevel`.
 * Used with `formDescription`, `formHeading`, and `formHeadingLevel`
 * when the label of the field should be the actual form title and
 * have a description with JSX that should be read out by screen readers.
 *
 * @param {UIOptions & {
 *  title?: UISchemaOptions['ui:title'],
 *  description?: UISchemaOptions['ui:description'],
 *  errorMessages?: UISchemaOptions['ui:errorMessages'],
 *  required?: UISchemaOptions['ui:required'],
 *  reviewField?: UISchemaOptions['ui:reviewField'],
 *  hidden?: UISchemaOptions['ui:hidden'],
 *  hint?: UIOptions['hint'],
 * }} stringOrOptions
 * @returns {UISchemaOptions}
 */
export const fileInputMultipleUI = stringOrOptions => {
  const {
    title,
    errorMessages,
    required,
    reviewField,
    hidden,
    ...uiOptions
  } = stringOrOptions;

  return {
    'ui:title': title,
    'ui:required': required,
    'ui:webComponentField': VaFileInputMultipleField,
    'ui:reviewField': reviewField || fileInputMultipleReviewField,
    'ui:hidden': hidden,
    'ui:options': {
      keepInPageOnReview: true,
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
};

/**
 * Schema for generic fileInputMultiple field
 *
 * ```js
 * exampleFileInput: {
 *   type: 'object',
 * }
 * ```
 */
export const fileInputMultipleSchema = {
  type: 'array',
  minItems: 1,
  items: {
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
  },
};
