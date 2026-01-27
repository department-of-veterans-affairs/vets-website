import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import VaRadioField from 'platform/forms-system/src/js/web-component-fields/VaRadioField';
import AddressViewField from 'platform/forms-system/src/js/components/AddressViewField';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import constants from 'vets-json-schema/dist/constants.json';

import ReviewCardField from 'platform/forms-system/src/js/components/ReviewCardField';

import {
  addressUI,
  addressSchema,
  updateFormDataAddress,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  contactInfoDescription,
  contactInfoUpdateHelpDescription,
  phoneEmailViewField,
} from '../content/contactInformation';

import {
  MILITARY_STATE_LABELS,
  MILITARY_STATE_VALUES,
  MILITARY_CITIES,
} from '../constants';

import { validateZIP } from '../validations';

const { phoneAndEmail } = fullSchema.properties;

const defaultAddressUI = {
  ...addressUI({
    keys: {
      street: 'addressLine1',
      street2: 'addressLine2',
      street3: 'addressLine3',
      postalCode: 'zipCode',
      isMilitary: 'view:livesOnMilitaryBase',
    },
  }),
};

// Use the 21-526EZ schema countries and filter constants.countries accordingly
const schemaCountries = fullSchema.definitions.country.enum;

// Filter countries to only include those in the schema, plus USA for "United States"
const filteredCountries = constants.countries.filter(
  country =>
    schemaCountries.includes(country.label) ||
    country.label === 'United States',
);

// Extract values and names, ensuring USA stays as "USA"
const COUNTRY_VALUES = filteredCountries.map(country => country.value);
const COUNTRY_NAMES = filteredCountries.map(
  country => (country.label === 'United States' ? 'USA' : country.label),
);

// Filter out military states from regular state options
const filteredStates = constants.states.USA.filter(
  state => !MILITARY_STATE_VALUES.includes(state.value),
);
const STATE_VALUES = filteredStates.map(state => state.value);
const STATE_LABELS = filteredStates.map(state => state.label);

// Helper function to determine if zipCode should be shown/required
const shouldShowZipCode = formData => {
  const isMilitary = formData.mailingAddress?.['view:livesOnMilitaryBase'];
  const isUSA = formData.mailingAddress?.country === 'USA';
  return isMilitary || isUSA;
};

/**
 * Update form data to remove selected military city & state and restore any
 * previously set city & state when the "I live on a U.S. military base"
 * checkbox is unchecked. See va.gov-team/issues/42216 for details
 * @param {object} oldFormData - Form data prior to interaction change
 * @param {object} formData - Form data after interaction change
 * @returns {object} - updated Form data with manipulated mailing address if the
 * military base checkbox state changes
 */
export const updateFormData = (oldFormData, formData) => {
  const updatedFormData = updateFormDataAddress(
    oldFormData,
    formData,
    ['mailingAddress'],
    null,
    {
      street: 'addressLine1',
      street2: 'addressLine2',
      street3: 'addressLine3',
      postalCode: 'zipCode',
      isMilitary: 'view:livesOnMilitaryBase',
    },
  );

  // Auto-detect military status based on city or state and set view:livesOnMilitaryBase accordingly
  if (updatedFormData.mailingAddress) {
    const { city, state } = updatedFormData.mailingAddress;
    const isMilitaryCity = city && MILITARY_CITIES.includes(city);
    const isMilitaryState = state && MILITARY_STATE_VALUES.includes(state);

    const oldMilitaryFlag =
      oldFormData.mailingAddress?.['view:livesOnMilitaryBase'];
    const newMilitaryFlag =
      updatedFormData.mailingAddress['view:livesOnMilitaryBase'];

    if (
      (isMilitaryCity || isMilitaryState) &&
      oldMilitaryFlag === newMilitaryFlag &&
      !newMilitaryFlag
    ) {
      updatedFormData.mailingAddress['view:livesOnMilitaryBase'] = true;
    }
  }

  return updatedFormData;
};

export const uiSchema = {
  'ui:title': 'Contact information',
  'ui:description': contactInfoDescription,
  phoneAndEmail: {
    'ui:title': 'Phone & email',
    'ui:field': ReviewCardField,
    'ui:options': {
      viewComponent: phoneEmailViewField,
    },
    primaryPhone: phoneUI('Phone number'),
    emailAddress: emailUI(),
  },
  mailingAddress: {
    ...defaultAddressUI,
    'ui:title': 'Mailing address',
    'ui:field': ReviewCardField,
    'ui:options': {
      ...defaultAddressUI['ui:options'],
      viewComponent: AddressViewField,
      classNames:
        'vads-web-component-pattern vads-web-component-pattern-address',
    },
    // Override country field to display 'USA' instead of 'United States'
    country: {
      ...defaultAddressUI.country,
      'ui:required': formData => {
        const addressData = formData.mailingAddress || {};
        return !addressData['view:livesOnMilitaryBase'];
      },
      'ui:options': {
        ...defaultAddressUI.country['ui:options'],
        updateSchema: (formData, schema, _uiSchema) => {
          const countryUI = _uiSchema;
          const addressFormData = formData.mailingAddress || {};
          const isMilitary = addressFormData['view:livesOnMilitaryBase'];

          if (isMilitary) {
            countryUI['ui:options'].inert = true;
            addressFormData.country = 'USA';
            return {
              enum: ['USA'],
              enumNames: ['USA'],
              default: 'USA',
            };
          }
          countryUI['ui:options'].inert = false;
          return {
            type: 'string',
            enum: COUNTRY_VALUES,
            enumNames: COUNTRY_NAMES,
          };
        },
      },
    },
    state: {
      'ui:title': 'State',
      'ui:autocomplete': 'address-level1',
      'ui:webComponentField': VaSelectField,
      'ui:errorMessages': {
        required: 'Please select a state',
      },
      'ui:options': {
        hideIf: formData =>
          !formData.mailingAddress?.['view:livesOnMilitaryBase'] &&
          formData.mailingAddress.country !== 'USA',
        classNames:
          'vads-web-component-pattern-field vads-web-component-pattern-address',
        hideEmptyValueInReview: true,
        updateSchema: (formData, schema, _uiSchema) => {
          const ui = _uiSchema;
          if (
            formData.mailingAddress?.['view:livesOnMilitaryBase'] ||
            MILITARY_CITIES.includes(formData.mailingAddress.city) ||
            MILITARY_STATE_VALUES.includes(formData.mailingAddress.state)
          ) {
            ui['ui:webComponentField'] = VaRadioField;
            ui['ui:errorMessages'] = {
              enum: 'Please select a military state',
            };
            return {
              enum: MILITARY_STATE_VALUES,
              enumNames: MILITARY_STATE_LABELS,
            };
          }
          ui['ui:webComponentField'] = VaSelectField;
          ui['ui:errorMessages'] = {
            required: 'Please select a state',
          };
          return {
            enum: STATE_VALUES,
            enumNames: STATE_LABELS,
          };
        },
      },
      'ui:required': formData =>
        formData.mailingAddress?.['view:livesOnMilitaryBase'] ||
        formData.mailingAddress.country === 'USA',
    },
    zipCode: {
      ...defaultAddressUI.zipCode,
      'ui:required': shouldShowZipCode,
      'ui:validations': [validateZIP],
      'ui:errorMessages': {
        required: 'Please enter a postal code',
        pattern:
          'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
      },
      'ui:options': {
        classNames:
          'vads-web-component-pattern-field vads-web-component-pattern-address',
        widgetClassNames: 'usa-input-medium',
        hideIf: formData => !shouldShowZipCode(formData),
      },
    },
    addressLine1: {
      ...defaultAddressUI.addressLine1,
      'ui:validations': [
        (errors, value) => {
          if (value) {
            const maxLength = 20;
            if (value.length > maxLength) {
              errors.addError(
                `Address line 1 must be ${maxLength} characters or less`,
              );
            }
          }
        },
      ],
    },
    addressLine2: {
      ...defaultAddressUI.addressLine2,
      'ui:validations': [
        (errors, value) => {
          if (value) {
            const maxLength = 20;
            if (value.length > maxLength) {
              errors.addError(
                `Address line 2 must be ${maxLength} characters or less`,
              );
            }
          }
        },
      ],
    },
    addressLine3: {
      ...defaultAddressUI.addressLine3,
      'ui:validations': [
        (errors, value) => {
          if (value) {
            const maxLength = 20;
            if (value.length > maxLength) {
              errors.addError(
                `Address line 3 must be ${maxLength} characters or less`,
              );
            }
          }
        },
      ],
    },
  },
  'view:contactInfoDescription': {
    'ui:description': contactInfoUpdateHelpDescription,
  },
};

export const schema = {
  type: 'object',
  properties: {
    phoneAndEmail,
    mailingAddress: addressSchema({
      keys: {
        street: 'addressLine1',
        street2: 'addressLine2',
        street3: 'addressLine3',
        postalCode: 'zipCode',
        isMilitary: 'view:livesOnMilitaryBase',
      },
    }),
    'view:contactInfoDescription': {
      type: 'object',
      properties: {},
    },
  },
};
