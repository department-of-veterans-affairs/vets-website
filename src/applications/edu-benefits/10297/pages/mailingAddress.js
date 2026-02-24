import React from 'react';
import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import constants from 'vets-json-schema/dist/constants.json';

// Taken from src/platform/forms-system/src/js/web-component-patterns/addressPattern.jsx
const POSTAL_CODE_PATTERNS = {
  CAN:
    '^(?=[^DdFfIiOoQqUu\\d\\s])[A-Za-z]\\d(?=[^DdFfIiOoQqUu\\d\\s])[A-Za-z]\\s{0,1}\\d(?=[^DdFfIiOoQqUu\\d\\s])[A-Za-z]\\d$',
  MEX: '^\\d{5}$',
  USA: '(^\\d{5}$)|(^\\d{5}[ -]{0,1}\\d{4})$',
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
      'ui:errorMessages': {
        ...addressUiSchema.street['ui:errorMessages'],
        required: 'You must provide a response',
        minLength: 'Please provide your full street address',
      },
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

          cityUI['ui:errorMessages'] = {
            required: 'You must provide a response',
            pattern: 'Please provide a valid city',
            minLength: 'Please provide a valid city',
          };

          if (livesOnMilitaryBase) {
            cityUI['ui:errorMessages'] = {
              required: 'You must provide a response',
              enum: 'Please select a type of post office: APO, DPO, or FPO',
            };
            return {
              type: 'string',
              title: 'APO/DPO/FPO',
              enum: ['APO', 'DPO', 'FPO'],
            };
          }

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
            stateUI['ui:errorMessages'] = {
              required: 'You must provide a response',
              enum: 'Please select a valid abbreviation: AA, AE, or AP',
            };
            return {
              type: 'string',
              title: 'AA/AE/AP',
              enum: ['AA', 'AE', 'AP'],
              enumNames: [
                'Armed Forces Americas (AA)',
                'Armed Forces Europe (AE)',
                'Armed Forces Pacific (AP)',
              ],
            };
          }
          if (formData.mailingAddress?.country === 'USA') {
            stateUI['ui:errorMessages'] = {
              required: 'You must provide a response',
              enum: 'Please select a valid state',
            };
            return {
              type: 'string',
              title: 'State',
              enum: constants.states.USA.map(state => state.value),
              enumNames: constants.states.USA.map(state => state.label),
            };
          }
          if (formData.mailingAddress?.country === 'CAN') {
            stateUI['ui:errorMessages'] = {
              required: 'You must provide a response',
              enum: 'Please select a valid province or territory',
            };
            return {
              type: 'string',
              title: 'Province/Territory',
              enum: constants.states.CAN.map(state => state.value),
              enumNames: constants.states.CAN.map(state => state.label),
            };
          }
          if (formData.mailingAddress?.country === 'MEX') {
            stateUI['ui:errorMessages'] = {
              required: 'You must provide a response',
              enum: 'Please select a valid state',
            };
            return {
              type: 'string',
              title: 'State',
              enum: constants.states.MEX.map(state => state.value),
              enumNames: constants.states.MEX.map(state => state.label),
            };
          }
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
      'ui:title': undefined,
      'ui:options': {
        ...addressUiSchema.postalCode['ui:options'],
        widgetClassNames: undefined,
        replaceSchema: (formData, _schema, _uiSchema) => {
          const { country } = formData.mailingAddress;

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
        postalCode: { type: 'string', minLength: 3, maxLength: 10 },
      },
    },
  },
  required: ['mailingAddress'],
};

export { schema, uiSchema };
