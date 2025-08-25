import React from 'react';
import { isEmpty } from 'lodash';
import { VaFileInputMultiple } from '../web-component-fields';
import navigationState from '../utilities/navigation/navigationState';
import { errorManager } from '../utilities/file/passwordErrorState';
import { MISSING_FILE } from '../validation';
import ReviewField from '../review/FileInputMultiple';

export const fileInputMultipleUI = options => {
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
    'ui:webComponentField': VaFileInputMultiple,
    'ui:required': typeof required === 'function' ? required : () => !!required,
    'ui:errorMessages': {
      required: 'A file is required to submit your application',
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
            !uiOptions.skipUpload &&
            isRequired &&
            isNavigationEvent &&
            !_encryptedFileWaitingForPassword;

          if (_required) {
            let hasFile = false;
            for (const file of data) {
              const _hasFile = file.confirmationCode && file.name && file.size;
              if (_hasFile) {
                hasFile = true;
                break;
              }
            }
            if (!hasFile) {
              errors.addError(MISSING_FILE);
              // don't do additional validation if missing file
              return;
            }
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
            errors.addError(`${Math.random()}`);
          }

          // was there an error due to a failed check inside a va-file-input instance?
          if (errorManager.getInternalFileInputErrors().some(error => error)) {
            errors.addError(`${Math.random()}`);
          }
        }
      },
    ],
    'ui:options': {
      ...uiOptions,
      keepInPageOnReview: true,
    },
    // items: {
    //   'ui:options': {
    //     viewField: fileView,
    //   }
    // },
    'ui:reviewField': ReviewField,
    // 'ui:confirmationField': (data) => {
    //   console.log('the data is....', data);
    //   return (
    //     <li>Testing!</li>
    //   )
    // },
    'ui:confirmationField': ({ formData }) => {
      if (!formData) {
        return null;
      }

      const data = (
        <ul>
          {formData.map((file, i) => (
            <li key={i}>{file.name}</li>
          ))}
        </ul>
      );
      return { data };
    },

    // warnings: {
    //   'ui:options': {
    //     keepInPageOnReview: true,
    //   },
    // },
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
        type: {
          type: 'string',
        },
      },
      ...options,
    },
  };
};
