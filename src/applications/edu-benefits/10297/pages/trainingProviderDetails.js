import {
  arrayBuilderItemFirstPageTitleUI,
  addressNoMilitaryUI,
  addressNoMilitarySchema,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  VaSelectField,
  VaTextInputField,
} from 'platform/forms-system/src/js/web-component-fields';
import constants from 'vets-json-schema/dist/constants.json';

import { trainingProviderArrayOptions } from '../helpers';

const addressUiSchema = addressNoMilitaryUI({});

// Taken from src/platform/forms-system/src/js/web-component-patterns/addressPattern.jsx
const POSTAL_CODE_PATTERNS = {
  CAN:
    '^(?=[^DdFfIiOoQqUu\\d\\s])[A-Za-z]\\d(?=[^DdFfIiOoQqUu\\d\\s])[A-Za-z]\\s{0,1}\\d(?=[^DdFfIiOoQqUu\\d\\s])[A-Za-z]\\d$',
  MEX: '^\\d{5}$',
  USA: '(^\\d{5}$)|(^\\d{5}[ -]{0,1}\\d{4})$',
};

const uiSchema = {
  ...arrayBuilderItemFirstPageTitleUI({
    title: 'Training provider name and mailing address',
    nounSingular: trainingProviderArrayOptions.nounSingular,
  }),
  providerName: textUI({
    title: 'Name of training provider',
    errorMessages: {
      required: 'You must provide a response',
    },
  }),
  providerAddress: {
    ...addressUiSchema,
    country: {
      ...addressUiSchema.country,
      'ui:errorMessages': {
        ...addressUiSchema.country['ui:errorMessages'],
        required: 'You must provide a response',
      },
    },
    street: {
      ...addressUiSchema.street,
      'ui:errorMessages': {
        ...addressUiSchema.street['ui:errorMessages'],
        required: 'You must provide a response',
        minLength: 'Please provide your full street address',
      },
    },
    city: {
      ...addressUiSchema.city,
      'ui:options': {
        ...addressUiSchema.city['ui:options'],
        replaceSchema: (_formData, _schema, _uiSchema) => {
          const cityUI = _uiSchema;

          cityUI['ui:errorMessages'] = {
            required: 'You must provide a response',
            pattern: 'Please provide a valid city',
            minLength: 'Please provide a valid city',
          };

          return {
            type: 'string',
            title: 'City',
            minLength: 2,
            maxLength: 20,
          };
        },
      },
    },
    state: {
      ...addressUiSchema.state,
      'ui:options': {
        ...addressUiSchema.state['ui:options'],
        replaceSchema: (formData, _schema, _uiSchema, index) => {
          const stateUI = _uiSchema;
          const country =
            formData.trainingProviders?.[index]?.providerAddress?.country ||
            formData.providerAddress?.country;
          switch (country) {
            case 'USA': {
              stateUI['ui:errorMessages'] = {
                required: 'You must provide a response',
                enum: 'Please select a valid state',
              };
              stateUI['ui:webComponentField'] = VaSelectField;
              return {
                type: 'string',
                title: 'State',
                enum: constants.states.USA.map(state => state.value),
                enumNames: constants.states.USA.map(state => state.label),
              };
            }
            case 'CAN': {
              stateUI['ui:errorMessages'] = {
                required: 'You must provide a response',
                enum: 'Please select a valid province or territory',
              };
              stateUI['ui:webComponentField'] = VaSelectField;
              return {
                type: 'string',
                title: 'Province/Territory',
                enum: constants.states.CAN.map(state => state.value),
                enumNames: constants.states.CAN.map(state => state.label),
              };
            }
            case 'MEX': {
              stateUI['ui:errorMessages'] = {
                required: 'You must provide a response',
                enum: 'Please select a valid state',
              };
              stateUI['ui:webComponentField'] = VaSelectField;
              return {
                type: 'string',
                title: 'State',
                enum: constants.states.MEX.map(state => state.value),
                enumNames: constants.states.MEX.map(state => state.label),
              };
            }
            default:
              stateUI['ui:webComponentField'] = VaTextInputField;
              return {
                type: 'string',
                title: 'State/County/Province',
              };
          }
        },
      },
    },
    postalCode: {
      ...addressUiSchema.postalCode,
      'ui:title': undefined,
      'ui:options': {
        ...addressUiSchema.postalCode['ui:options'],
        widgetClassNames: undefined,
        replaceSchema: (formData, _schema, _uiSchema, index) => {
          const country =
            formData.trainingProviders?.[index]?.providerAddress?.country ||
            formData.providerAddress?.country;

          const newUiSchema = _uiSchema;
          const newSchema = {
            type: 'string',
            title: 'Postal code',
            minLength: 3,
            maxLength: 10,
          };

          newUiSchema['ui:errorMessages'] = {
            required: 'You must provide a response',
            pattern: 'Please provide a valid postal code',
            minLength: 'Please provide a valid postal code',
          };

          // country-specific error messages
          if (country === 'USA') {
            newSchema.pattern = POSTAL_CODE_PATTERNS.USA;
            newSchema.title = 'Zip code';
            newUiSchema['ui:errorMessages'] = {
              ...newUiSchema['ui:errorMessages'],
              pattern: 'Please provide a valid zip code',
              minLength: 'Please provide a valid zip code',
            };
          } else if (['CAN', 'MEX'].includes(country)) {
            newSchema.pattern = POSTAL_CODE_PATTERNS[country];
          }

          return {
            ...newSchema,
          };
        },
      },
    },
  },
};

const schema = {
  type: 'object',
  required: ['providerName', 'providerAddress'],
  properties: {
    providerName: { type: 'string', minLength: 3 },
    providerAddress: addressNoMilitarySchema({
      extend: {
        street: { minLength: 3, maxLength: 40 },
        street2: { maxLength: 40 },
        street3: { maxLength: 40 },
        city: { minLength: 2, maxLength: 20 },
        postalCode: { minLength: 3, maxLength: 10 },
      },
    }),
  },
};

export { schema, uiSchema };
