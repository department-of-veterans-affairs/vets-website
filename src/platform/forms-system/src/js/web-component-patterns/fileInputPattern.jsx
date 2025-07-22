import React from 'react';
import { isEmpty } from 'lodash';
import { scrollAndFocus } from 'platform/utilities/scroll';
import { VaFileInputField } from '../web-component-fields';
import navigationState from '../utilities/navigation/navigationState';
import errorStates from '../utilities/file/passwordErrorState';

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
 *   minFileSize: 1024,
 *   headerSize: '3',
 *   skipUpload: true, // set to true if your app does not yet have a backend for upload
 *   formNumber: '20-10206', // required for upload
 *   additionalInputRequired: true, // user must supply additional input
 *   additionalInput: (error, data) => {
 *     const { documentStatus } = data;
 *     return (
 *       <VaSelect
 *         required
 *         error={error}
 *         value={documentStatus}
 *         label="Document status"
 *       >
 *         <option value="public">Public</option>
 *         <option value="private">Private</option>
 *       </VaSelect>
 *     );
 *   },
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
 * @param {Object } options
 * @param {UISchemaOptions['ui:title']} options.title
 * @param {UISchemaOptions['ui:description']} options.description
 * @param {UISchemaOptions['ui:hint']} options.hint
 * @param {ObjUISchemaOptions['ui:errorMessages']} options.errorMessages
 * @param {UISchemaOptions['ui:labelHeaderLevel']} options.labelHeaderLevel
 * @param {UISchemaOptions['ui:messageAriaDescribedby']} options.messageAriaDescribedBy
 * @param {string | string[]} options.accept - File types to accept
 * @param {number} options.maxFileSize - maximum allowed file size in bytes
 * @param {number} options.minFileSize - minimum allowed file size in bytes
 * @param {string} options.headerSize - Header level for label
 * @param {boolean} options.additionalInputRequired - is additional information required
 * @param {((error:any, data:any) => React.ReactNode) } options.additionalInput - renders the additional information
 * @param {(e: CustomEvent) => {[key: string]: any}} options.handleAdditionalInput - function to handle event payload from additional info
 * @param {string} options.fileUploadUrl - url to which file will be uploaded
 * @param {string} options.formNumber - the form's number
 * @param {boolean} options.skipUpload - skip attempt to upload in dev when there is no backend
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

        const { additionalData, _id } = data;

        if (
          !uiOptions.skipUpload &&
          isRequired &&
          isNavigationEvent &&
          data.name !== 'uploading'
        ) {
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
        if (!_id) return;
        const passwordErrorManager = errorStates.getInstance(_id);

        const passwordError = passwordErrorManager.hasPasswordError();
        const touched = passwordErrorManager.touched();
        if ((isNavigationEvent || touched) && passwordError) {
          errors.isEncrypted.addError('Encrypted file requires a password.');
          scrollAndFocus(`va-file-input[name=${_id}]`);
        } else {
          passwordErrorManager.setTouched(true);
        }

        if (
          uiOptions.additionalInputRequired &&
          isEmpty(additionalData) &&
          (isNavigationEvent || touched)
        ) {
          const errorMessage =
            uiErrorMessages.additionalInput || 'Enter additional input';
          errors.additionalData.addError(errorMessage);

          // prevents the clearing of a password error (if one exists) after this error is cleared
          if (passwordError) {
            passwordErrorManager.setTouched(true);
          }
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
 * exampleFileInput: {
 *   type: 'object',
 * }
 * ```
 */
export const fileInputSchema = (options = {}) => {
  return {
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
      additionalData: {
        type: 'object',
        properties: {},
      },
      type: {
        type: 'string',
      },
      _id: {
        type: 'string',
      },
    },
    ...options,
  };
};
