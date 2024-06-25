import {
  checkboxGroupUI,
  checkboxGroupSchema,
  textareaUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  herbicidePageTitle,
  herbicideQuestion,
  otherInvalidCharError,
  validateSelections,
} from '../../content/toxicExposure';
import { formTitle } from '../../utils';
import { HERBICIDE_LOCATIONS } from '../../constants';

export const uiSchema = {
  'ui:title': formTitle(herbicidePageTitle),
  toxicExposure: {
    herbicide: checkboxGroupUI({
      title: herbicideQuestion,
      labels: HERBICIDE_LOCATIONS,
      required: false,
    }),
    otherHerbicideLocations: {
      description: textareaUI({
        title: 'Other locations not listed here (250 characters maximum)',
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
          'herbicide',
          'otherHerbicideLocations',
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
        herbicide: checkboxGroupSchema(Object.keys(HERBICIDE_LOCATIONS)),
        otherHerbicideLocations: {
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
