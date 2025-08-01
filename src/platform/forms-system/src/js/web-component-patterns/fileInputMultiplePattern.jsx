import { isEmpty } from 'lodash';
import { VaFileInputMultiple } from '../web-component-fields';
import navigationState from '../utilities/navigation/navigationState';
import { errorManager } from '../utilities/file/passwordErrorState';

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
      (errors, data) => {
        const isNavigationEvent = navigationState.getNavigationEventStatus();

        if (isNavigationEvent) {
          for (const instance of errorManager.getPasswordInstances()) {
            if (instance) {
              // add a placeholder error to force re-render
              errors.addError('placeholder');
              instance.setTouched(true);
            }
          }
        }

        if (
          isNavigationEvent &&
          uiOptions.additionalInputRequired &&
          data.some(file => isEmpty(file.additionalData))
        ) {
          // add a placeholder error to force re-render
          errors.addError('placeholder');
        }

        // if (isNavigationEvent && uiOptions.additionalInputRequired) {
        //   console.log(formData);
        // }
      },
    ],
    'ui:options': {
      ...uiOptions,
    },
    // 'ui:reviewField': ({ children }) => {
    //   return (
    //     <div className="review-row">
    //       <dt>{title}</dt>
    //       <dd>{children.props?.formData?.name}</dd>
    //     </div>
    //   );
    // },
    // 'ui:confirmationField': ({ formData }) => ({
    //   data: formData?.name,
    //   label: title,
    // }),
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
    },
  };
};
