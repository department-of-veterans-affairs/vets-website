import {
  checkboxGroupUI,
  checkboxGroupSchema,
  textareaUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  additionalExposuresQuestion,
  additionalExposuresPageTitle,
  specifyOtherExposuresLabel,
  validateSelections,
  otherInvalidCharError,
} from '../../content/toxicExposure';
import { formTitle } from '../../utils';
import { ADDITIONAL_EXPOSURES } from '../../constants';

/** @type {PageSchema} */
export const uiSchema = {
  'ui:title': formTitle(additionalExposuresPageTitle),
  toxicExposure: {
    otherExposures: checkboxGroupUI({
      title: additionalExposuresQuestion,
      labels: ADDITIONAL_EXPOSURES,
      required: false,
    }),
    specifyOtherExposures: {
      description: textareaUI({
        title: specifyOtherExposuresLabel,
        errorMessages: {
          pattern: otherInvalidCharError,
        },
      }),
    },
  },
  'ui:validations': [
    {
      validator: (errors, formData) => {
        validateSelections(
          errors,
          formData,
          'otherExposures',
          'specifyOtherExposures',
          'hazards',
        );
      },
    },
  ],
};

export const schema = {
  type: 'object',
  properties: {
    toxicExposure: {
      type: 'object',
      properties: {
        otherExposures: checkboxGroupSchema(Object.keys(ADDITIONAL_EXPOSURES)),
        specifyOtherExposures: {
          type: 'object',
          properties: {
            description: {
              type: 'string',
              pattern: "^([-a-zA-Z0-9'.,&# ])+$",
              maxLength: 250,
            },
          },
        },
      },
    },
  },
};
