import React from 'react';
import { isEmpty } from 'lodash';
import { VaFileInputField } from '../web-component-fields';
import navigationState from '../utilities/navigation/navigationState';
import errorStates from '../utilities/file/passwordErrorState';
import {
  MISSING_PASSWORD_ERROR,
  MISSING_FILE,
  MISSING_ADDITIONAL_INFO,
  filePresenceValidation,
} from '../validation';

/**
 * uiSchema for file input field
 *
 * Usage uiSchema:
 * ```js
 * exampleFileInputUI: fileInputUI({
 *   title: 'Simple fileInput field',
 *   required: true,
 * })
 * exampleFileInputUI: fileInputUI({
 *   title: 'FileInput field',
 *   required: true,
 *   hint: 'This is a hint',
 *   fileUploadUrl: 'https://api.test.va.gov,
 *   accept: '.pdf,.jpeg,.png',
 *   name: 'form-upload-file-input',
 *   errorMessages: { required: 'File upload required' },
 *   maxFileSize: 1048576,
 *   minFileSize: 1024,
 *   labelHeaderLevel: '3',
 *   skipUpload: true, // set to true if your app does not yet have a backend for upload
 *   disallowEncryptedPdfs: true, // set to true to prohibit upload of encrypted pdfs
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
 * @param {boolean | ((formData: any) => boolean)} options.required
 * @param {UISchemaOptions['ui:description']} [options.description]
 * @param {UISchemaOptions['ui:hint']} [options.hint]
 * @param {ObjUISchemaOptions['ui:errorMessages']} [options.errorMessages]
 * @param {UISchemaOptions['ui:labelHeaderLevel']} [options.labelHeaderLevel]
 * @param {UISchemaOptions['ui:messageAriaDescribedby']} [options.messageAriaDescribedBy]
 * @param {UISchemaOptions['ui:reviewField']} [options.reviewField]
 * @param {UISchemaOptions['ui:confirmationField']} [options.confirmationField]
 * @param {string | string[]} [options.accept] - File types to accept
 * @param {number} [options.maxFileSize] - maximum allowed file size in bytes
 * @param {number} [options.minFileSize] - minimum allowed file size in bytes
 * @param {boolean} [options.additionalInputRequired] - is additional information required
 * @param {((error:any, data:any) => React.ReactNode) } [options.additionalInput] - renders the additional information
 * @param {(e: CustomEvent) => {[key: string]: any}} [options.handleAdditionalInput] - function to handle event payload from additional info
 * @param {string} [options.fileUploadUrl] - url to which file will be uploaded
 * @param {string} [options.formNumber] - the form's number
 * @param {boolean} [options.skipUpload] - skip attempt to upload in dev when there is no backend
 * @param {boolean} [options.disallowEncryptedPdfs] - don't allow encrypted pdfs
 * @param {function} [options.createPayload] - custom function that creates the payload used when uploading the file
 * @param {function} [options.parseResponse] - custom function that transforms the response from the server after an upload

 }}
 * @returns {UISchemaOptions}
 */
export const fileInputUI = options => {
  const {
    title,
    description,
    errorMessages,
    required,
    reviewField,
    confirmationField,
    ...uiOptions
  } = options;

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
      required: MISSING_FILE,
      ...errorMessages,
    },
    'ui:validations': [
      (errors, data, formData, schema, uiErrorMessages) => {
        // don't enter error state unless navigation attempted
        const isNavigationEvent = navigationState.getNavigationEventStatus();
        if (!isNavigationEvent) return;

        const isRequired =
          typeof required === 'function' ? required(formData) : !!required;

        const { additionalData, _id } = data;
        const hasCompleteFile = filePresenceValidation(data);

        // if file is encrypted skip this check
        // validation will not pass for an encrypted file unless password present, which will ensure file existence
        if (isRequired && !hasCompleteFile && !data.isEncrypted) {
          errors.addError(uiErrorMessages.required);
          return;
        }

        const passwordErrorManager = errorStates.getInstance(_id);

        const passwordError = passwordErrorManager.hasPasswordError();
        if (passwordError) {
          errors.isEncrypted.addError(MISSING_PASSWORD_ERROR);
          return;
        }

        if (uiOptions.additionalInputRequired && isEmpty(additionalData)) {
          const errorMessage =
            uiErrorMessages.additionalInput || MISSING_ADDITIONAL_INFO;
          errors.additionalData.addError(errorMessage);
        }
      },
    ],
    'ui:options': {
      ...uiOptions,
    },
    'ui:reviewField':
      reviewField ||
      (({ children }) => {
        return (
          <div className="review-row">
            <dt>{title}</dt>
            <dd>{children.props?.formData?.name}</dd>
          </div>
        );
      }),
    'ui:confirmationField':
      confirmationField ||
      (({ formData }) => ({
        data: formData?.name,
        label: title,
      })),
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
 *
 * @param {Object} [options] - Additional schema options
 * @returns {Object} JSON schema for file input
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
