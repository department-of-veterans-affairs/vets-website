import React from 'react';
import { isEmpty } from 'lodash';
import { scrollAndFocus } from 'platform/utilities/scroll';
import { VaFileInputField } from '../web-component-fields';
import navigationState from '../utilities/navigation/navigationState';

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
 * exampleFileInputUI: fileInputUI('Simple fileInput field')
 * exampleFileInputUI: fileInputUI({
 *   title: 'FileInput field',
 *   hint: 'This is a hint',
 *   fileUploadUrl: 'https://api.test.va.gov,
 *   accept: '.pdf,.jpeg,.png',
 *   name: 'form-upload-file-input',
 *   errorMessages: { required: 'File upload required' },
 *   maxFileSize: 1048576,
 *   headerSize: '3',
 *   skipUpload: true, // set to true if your app does not yet have a backend for upload
 *   formNumber: '20-10206', // required for upload
 *   additionalInputRequired: true, // user must supply additional input
 *   additionalInput: ( // will be rendered
 *     <VaSelect label="What kind of file is this?">
 *       <option value="public">Public</option>
 *       <option value="private">Private</option>
 *     </VaSelect />
 *   ),
 *   handleAdditionalInput: (e) => {    // handle optional additional input
 *     return { documentStatus: e.detail.value }
 *   }
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
        const isNavigationEvent = navigationState.getNavigationEventStatus();
        const isRequired =
          typeof required === 'function' ? required(formData) : !!required;

        const { additionalData, ...rest } = data;
        const untouched =
          isEmpty(additionalData) &&
          Object.values(rest).every(value => value === undefined);

        if (isRequired && untouched && isNavigationEvent) {
          filePresenceValidation(
            errors,
            data,
            formData,
            schema,
            uiErrorMessages,
          );
        }

        // don't do any additional validation if user tries to advance
        // without having interacted with component
        if (untouched) return;

        if (
          uiOptions.encrypted &&
          (data.hasPasswordError ||
            (!data.password &&
              isNavigationEvent &&
              (isRequired || data.name === 'uploading')))
        ) {
          errors.isEncrypted.addError('Encrypted file requires a password.');
          scrollAndFocus(`va-file-input`);
        }

        if (
          uiOptions.additionalInputRequired &&
          (data.hasAdditionalInputError ||
            (isEmpty(data.additionalData) && isNavigationEvent))
        ) {
          const errorMessage =
            uiErrorMessages.additionalInput || 'Enter additional input';
          errors.additionalData.addError(errorMessage);
        }
      },
    ],
    'ui:options': {
      ...uiOptions,
    },
    'ui:reviewField': ({ children }) => {
      return (
        <div className="review-row">
          <dt>{title}</dt>
          <dd>{children.props?.formData?.name}</dd>
        </div>
      );
    },
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
    password: {
      type: 'string',
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
    additionalData: {
      type: 'object',
      properties: {},
    },
    hasPasswordError: {
      type: 'boolean',
    },
    hasAdditionalInputError: {
      type: 'boolean',
    },
    type: {
      type: 'string',
    },
  },
});
