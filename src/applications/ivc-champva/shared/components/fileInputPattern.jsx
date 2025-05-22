import React from 'react';
import PropTypes from 'prop-types';
import { getFileSize } from 'platform/forms-system/src/js/web-component-fields/vaFileInputFieldHelpers';
import VaFileInputMultipleField from './VaFileInputMultipleField';

// For single file upload component, see src/platform/forms-system/src/js/web-component-patterns/fileInputPattern.jsx

const ReviewFieldPropTypes = {
  children: PropTypes.node,
  formData: PropTypes.any,
};

function fileInputMultipleReviewField({ children }) {
  fileInputMultipleReviewField.propTypes = ReviewFieldPropTypes;
  return (
    <>
      {children?.props?.formData?.map(item => (
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
 * Web component v3 uiSchema for generic fileInputMultiple field
 *
 * Usage uiSchema:
 * ```js
 * exampleFileInput: fileInputMultipleUI('Simple fileInput field')
 * exampleFileInput: fileInputMultipleUI({
 *   title: 'FileInput field',
 *   hint: 'This is a hint',
 * })
 * ```
 *
 * Usage schema:
 * ```js
 * exampleFileInput: fileInputMultipleSchema,
 * required: ['exampleFileInput']
 * ```
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
 * Schema for generic fileInputMultiple field
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
