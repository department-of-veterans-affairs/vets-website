import React from 'react';
import { isEmpty } from 'lodash';
import { VaFileInputMultiple } from '../web-component-fields';
import navigationState from '../utilities/navigation/navigationState';
import { errorManager } from '../utilities/file/passwordErrorState';
import { MISSING_FILE, filePresenceValidation } from '../validation';
import ReviewField from '../review/FileInputMultiple';

/**
 * uiSchema for multiple file input field
 *
 * Usage uiSchema:
 * ```js
 * exampleMultipleFileInputUI: fileInputMultipleUI({
 *   title: 'Simple multiple fileInput field',
 *   required: true,
 * })
 * exampleMultipleFileInputUI: fileInputMultipleUI({
 *   title: 'Multiple FileInput field',
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
 *   additionalInputUpdate: (instance, error, data) => {
 *     instance.setAttribute('error', error);
 *     if (data) {
 *       instance.setAttribute('value', data.documentStatus);
 *     }
 *   },
 *   handleAdditionalInput: (e) => {    // handle optional additional input
 *     return { documentStatus: e.detail.value }
 *   },
 *   additionalInputLabels: {            // explicit labels for review page
 *     documentStatus: { public: 'Public', private: 'Private' },
 *   },
 * })
 * ```
 *
 * Usage schema:
 * ```js
 * exampleMultipleFileInput: fileInputMultipleSchema(),
 * required: ['exampleMultipleFileInput']
 *
 * // or
 * exampleMultipleFileInput: {
 *   type: 'array',
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
 * @param {Object} options
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
 * @param {(instance: any, error: any, data: any) => void} [options.additionalInputUpdate] - function to update additional input instance
 * @param {(e: CustomEvent) => {[key: string]: any}} [options.handleAdditionalInput] - function to handle event payload from additional info
 * @param {Record<string, Record<string, string>>} [options.additionalInputLabels] - explicit value-to-label mapping for additional input fields on the review page, e.g. `{ documentStatus: { public: 'Public', private: 'Private' } }`. Falls back to DOM querying if not provided.
 * @param {string} [options.fileUploadUrl] - url to which file will be uploaded
 * @param {string} [options.formNumber] - the form's number
 * @param {boolean} [options.skipUpload] - skip attempt to upload in dev when there is no backend
 * @param {boolean} [options.disallowEncryptedPdfs] - don't allow encrypted pdfs
 * @param {Record<string, { maxFileSize: number, minFileSize: number }>} [options.fileSizesByFileType] - object that specifies max and min file size limits by file type or by default
 * @returns {UISchemaOptions}
 */
export const fileInputMultipleUI = options => {
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
    'ui:webComponentField': VaFileInputMultiple,
    'ui:required': typeof required === 'function' ? required : () => !!required,
    'ui:errorMessages': {
      required: MISSING_FILE,
      ...errorMessages,
    },
    'ui:validations': [
      (errors, data, formData) => {
        const isNavigationEvent = navigationState.getNavigationEventStatus();
        const passwordErrorInstances = errorManager.getPasswordInstances();
        if (isNavigationEvent) {
          const isRequired =
            typeof required === 'function' ? required(formData) : !!required;

          // user selected an encrypted file but has not yet provided password
          // don't flag for missing file
          const _encryptedFileWaitingForPassword = passwordErrorInstances.some(
            instance =>
              instance &&
              instance.getNeedsPassword() &&
              !instance.getHasPassword(),
          );

          const _required =
            isRequired &&
            isNavigationEvent &&
            !_encryptedFileWaitingForPassword;

          if (_required && !filePresenceValidation(data)) {
            errors.addError(MISSING_FILE);
            // don't do additional validation if missing file
            return;
          }

          errorManager.setTouched();
          passwordErrorInstances.forEach(instance => {
            if (instance) {
              if (instance.getNeedsPassword() && !instance.getHasPassword()) {
                // add a placeholder error to force re-render
                errors.addError(`${Math.random()}`);
              }
              instance.setTouched(true);
            }
          });

          if (
            uiOptions.additionalInputRequired &&
            (data.length === 0 ||
              data.some(file => isEmpty(file.additionalData)))
          ) {
            // add a placeholder error to force re-render
            errors.addError(`${Math.random()}`);
          }

          // was there an errror in any file due to bad file check?
          const fileCheckError = errorManager
            .getFileCheckErrors()
            .some(error => !!error);
          if (fileCheckError) {
            // add a placeholder error to force re-render
            errors.addError(`${Math.random()}`);
          }

          // was there an error due to a failed check inside a va-file-input instance?
          if (errorManager.getInternalFileInputErrors().some(error => error)) {
            // add a placeholder error to force re-render
            errors.addError(`${Math.random()}`);
          }
        }
      },
    ],
    'ui:options': {
      ...uiOptions,
      keepInPageOnReview: true,
    },
    'ui:reviewField': reviewField || ReviewField,
    'ui:confirmationField':
      confirmationField ||
      (({ formData }) => {
        if (!formData) {
          return null;
        }

        const data = (
          <>
            {formData.map((file, i) => {
              const hasAdditionalData =
                file.additionalData &&
                Object.keys(file.additionalData).length > 0;
              if (!hasAdditionalData) {
                return <div key={i}>{file.name}</div>;
              }
              return (
                <ul key={i}>
                  <li>
                    <span className="vads-u-color--gray">Name</span>:{' '}
                    {file.name}
                  </li>
                  {Object.entries(file.additionalData).map(([key, value]) => (
                    <li key={key}>
                      <span className="vads-u-color--gray">
                        {key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, s => s.toUpperCase())
                          .trim()}
                      </span>
                      : {file.additionalDataLabels?.[key] || value}
                    </li>
                  ))}
                </ul>
              );
            })}
          </>
        );
        return { data };
      }),
  };
};

/**
 * Schema for fileInputMultipleUI
 *
 * ```js
 * exampleMultipleFileInput: fileInputMultipleSchema()
 * ```
 *
 * @param {Object} [options] - Additional schema options
 * @returns {Object} JSON schema for multiple file input (array of file objects)
 */
export const fileInputMultipleSchema = (options = {}) => {
  return {
    type: 'array',
    default: [],
    items: {
      type: 'object',
      properties: {
        confirmationCode: {
          type: 'string',
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
        additionalData: {
          type: 'object',
          properties: {},
        },
        additionalDataLabels: {
          type: 'object',
          properties: {},
        },
        type: {
          type: 'string',
        },
      },
      ...options,
    },
  };
};
