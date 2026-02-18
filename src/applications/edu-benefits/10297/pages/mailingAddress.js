import React from 'react';
import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import get from 'platform/utilities/data/get';
import constants from 'vets-json-schema/dist/constants.json';

// Taken from src/platform/forms-system/src/js/web-component-patterns/addressPattern.jsx
const POSTAL_CODE_PATTERNS = {
  CAN:
    '^(?=[^DdFfIiOoQqUu\\d\\s])[A-Za-z]\\d(?=[^DdFfIiOoQqUu\\d\\s])[A-Za-z]\\s{0,1}\\d(?=[^DdFfIiOoQqUu\\d\\s])[A-Za-z]\\d$',
  MEX: '^\\d{5}$',
  USA: '^\\d{5}$',
};

const POSTAL_CODE_PATTERN_ERROR_MESSAGES = {
  CAN: {
    required: 'Enter a postal code',
    pattern: 'Enter a valid 6-character postal code',
  },
  MEX: {
    required: 'Enter a postal code',
    pattern: 'Enter a valid 5-digit postal code',
  },
  USA: {
    required: 'Enter a zip code',
    pattern: 'Enter a valid 5-digit zip code',
  },
  NONE: {
    required: 'Enter a postal code',
    pattern: 'Enter a valid postal code',
  },
  OTHER: {
    required:
      'Enter a postal code that meets your country’s requirements. If your country doesn’t require a postal code, enter NA.',
    pattern: 'Enter a valid postal code',
  },
};

const addressUiSchema = addressUI({ omit: ['street3'] });
const uiSchema = {
  ...titleUI({
    title: 'Review your mailing address',
    description: (
      <>
        We’ll send any important information about this application to this
        address.
        <p>
          This is the mailing address we have on file for you. If you notice any
          errors, please correct them now.
        </p>
        <p>
          <b>Note:</b> If you want to update your personal information for other
          VA benefits, you can do that from your profile.
        </p>
        <p>
          <va-link href="/profile" text="Go to your profile" />
        </p>
      </>
    ),
    classNames: 'vads-u-color--base vads-u-margin-top--0',
  }),
  mailingAddress: {
    ...addressUiSchema,
    country: {
      ...addressUiSchema.country,
      'ui:webComponentField': undefined,
      'ui:options': {
        ...addressUiSchema.country['ui:options'],
        updateSchema: (formData, _schema, _uiSchema) => {
          const countryUI = _uiSchema;
          const addressFormData = formData?.mailingAddress;
          const livesOnMilitaryBase = formData.mailingAddress?.isMilitary;
          if (livesOnMilitaryBase) {
            countryUI['ui:disabled'] = true;
            const USA = {
              value: 'USA',
              label: 'United States',
            };
            addressFormData.country = USA.value;
            return {
              enum: [USA.value],
              enumNames: [USA.label],
              default: USA.value,
            };
          }
          countryUI['ui:disabled'] = false;
          return {
            type: 'string',
            enum: constants.countries.map(country => country.value),
            enumNames: constants.countries.map(country => country.label),
          };
        },
      },
    },
    street: {
      ...addressUiSchema.street,
      'ui:webComponentField': undefined,
    },
    street2: {
      ...addressUiSchema.street2,
      'ui:webComponentField': undefined,
      'ui:options': {
        ...addressUiSchema.street2['ui:options'],
        updateSchema: (_formData, _schema) => {
          return {
            ..._schema,
            title: 'Street address line 2',
          };
        },
      },
    },
    city: {
      ...addressUiSchema.city,
      'ui:webComponentField': undefined,
      'ui:options': {
        ...addressUiSchema.city['ui:options'],
        replaceSchema: (formData, _schema, _uiSchema) => {
          const livesOnMilitaryBase = formData.mailingAddress?.isMilitary;
          const cityUI = _uiSchema;

          if (livesOnMilitaryBase) {
            // cityUI['ui:webComponentField'] = VaSelectField;
            cityUI['ui:errorMessages'] = {
              required: 'Select a type of post office: APO, DPO, or FPO',
              enum: 'Select a type of post office: APO, DPO, or FPO',
            };
            return {
              type: 'string',
              title: 'APO/DPO/FPO',
              enum: ['APO', 'DPO', 'FPO'],
            };
          }

          // cityUI['ui:webComponentField'] = VaTextInputField;
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
      'ui:webComponentField': undefined,
      'ui:options': {
        ...addressUiSchema.state['ui:options'],
        replaceSchema: (formData, _schema, _uiSchema) => {
          const livesOnMilitaryBase = formData.mailingAddress?.isMilitary;
          const stateUI = _uiSchema;
          if (livesOnMilitaryBase) {
            // stateUI['ui:webComponentField'] = VaSelectField;
            stateUI['ui:errorMessages'] = {
              required: 'Select an abbreviation: AA, AE, or AP',
              enum: 'Select an abbreviation: AA, AE, or AP',
            };
            return {
              type: 'string',
              title: 'AE/AA/AP',
              enum: ['AE', 'AA', 'AP'],
              enumNames: [
                'AE - APO/DPO/FPO',
                'AA - APO/DPO/FPO',
                'AP - APO/DPO/FPO',
              ],
            };
          }
          if (formData.mailingAddress?.country === 'USA') {
            // stateUI['ui:webComponentField'] = VaSelectField;
            stateUI['ui:errorMessages'] = {
              required: 'Select a state',
              enum: 'Select a state',
            };
            return {
              type: 'string',
              title: 'State',
              enum: constants.states.USA.map(state => state.value),
              enumNames: constants.states.USA.map(state => state.label),
            };
          }
          if (formData.mailingAddress?.country === 'CAN') {
            // stateUI['ui:webComponentField'] = VaSelectField;
            stateUI['ui:errorMessages'] = {
              required: 'Select a province or territory',
              enum: 'Select a province or territory',
            };
            return {
              type: 'string',
              title: 'State/County/Province',
              enum: constants.states.CAN.map(state => state.value),
              enumNames: constants.states.CAN.map(state => state.label),
            };
          }
          if (formData.mailingAddress?.country === 'MEX') {
            // stateUI['ui:webComponentField'] = VaSelectField;
            stateUI['ui:errorMessages'] = {
              required: 'Select a state',
              enum: 'Select a state',
            };
            return {
              type: 'string',
              title: 'State',
              enum: constants.states.MEX.map(state => state.value),
              enumNames: constants.states.MEX.map(state => state.label),
            };
          }
          // stateUI['ui:webComponentField'] = VaTextInputField;
          return {
            type: 'string',
            title: 'State/County/Province',
          };
        },
      },
    },
    postalCode: {
      ...addressUiSchema.postalCode,
      'ui:webComponentField': undefined,
      'ui:options': {
        ...addressUiSchema.postalCode['ui:options'],
        widgetClassNames: undefined,
        replaceSchema: (formData, _schema, _uiSchema, index, path) => {
          const addressPath = path.slice(0, -1); // path is ['address', 'currentField']
          const data = get(addressPath, formData) ?? {};
          const { country, isMilitary } = data;

          const newUiSchema = _uiSchema;
          const newSchema = _schema;

          // country-specific error messages
          if (country === 'USA') {
            newUiSchema['ui:errorMessages'] =
              POSTAL_CODE_PATTERN_ERROR_MESSAGES.USA;
          } else if (['CAN', 'MEX'].includes(country)) {
            newUiSchema['ui:errorMessages'] =
              POSTAL_CODE_PATTERN_ERROR_MESSAGES[country];
          } else if (!country) {
            newUiSchema['ui:errorMessages'] =
              POSTAL_CODE_PATTERN_ERROR_MESSAGES.NONE;
          } else {
            newUiSchema['ui:errorMessages'] =
              POSTAL_CODE_PATTERN_ERROR_MESSAGES.OTHER;
          }

          addressSchema.type = 'string';
          // country-specific patterns
          if (isMilitary) {
            newSchema.pattern = POSTAL_CODE_PATTERNS.USA;
          } else if (['CAN', 'MEX', 'USA'].includes(country)) {
            newSchema.pattern = POSTAL_CODE_PATTERNS[country];
          } else {
            newSchema.pattern = '^[A-Z0-9 -]{3,10}$';
          }

          return {
            ...newSchema,
          };
        },
      },
    },
    'view:militaryBaseDescription': {
      'ui:description': (
        <va-additional-info trigger="Learn more about military base addresses">
          <span>
            U.S. military bases are considered a domestic address and a part of
            the United States.
          </span>
        </va-additional-info>
      ),
    },
  },
};

const addressSchemaWithoutStreet3 = addressSchema({ omit: ['street3'] });
const schema = {
  type: 'object',
  properties: {
    mailingAddress: {
      ...addressSchemaWithoutStreet3,
      properties: {
        ...addressSchemaWithoutStreet3.properties,
        street: { type: 'string', minLength: 3, maxLength: 40 },
        street2: { type: 'string', maxLength: 40 },
        city: { type: 'string', minLength: 2, maxLength: 20 },
        postalCode: { type: 'string', maxLength: 10 },
      },
    },
  },
  required: ['mailingAddress'],
};

export { schema, uiSchema };
