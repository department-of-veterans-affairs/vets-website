import { createSelector } from 'reselect';
import { states } from '@department-of-veterans-affairs/platform-forms/address';

import get from '@department-of-veterans-affairs/platform-forms-system/get';
import set from '@department-of-veterans-affairs/platform-forms-system/set';
import unset from '@department-of-veterans-affairs/platform-utilities/unset';
import {
  postOfficeOptions,
  regionOptions,
  addressFields,
} from '../../constants';
import { radioUI, radioSchema } from './radioHelper';

import fullSchema from '../0873-schema.json';

export const stateRequiredCountries = new Set(['USA', 'CAN', 'MEX']);

const militaryStates = states.USA.filter(
  state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA',
).map(state => state.value);
const militaryLabels = states.USA.filter(
  state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA',
).map(state => state.label);
const usaStates = states.USA.map(state => state.value);
const usaLabels = states.USA.map(state => state.label);
const canProvinces = states.CAN.map(state => state.value);
const canLabels = states.CAN.map(state => state.label);
const mexStates = states.MEX.map(state => state.value);
const mexLabels = states.MEX.map(state => state.label);

function isMilitaryCity(city = '') {
  const lowerCity = city.toLowerCase().trim();

  return lowerCity === 'apo' || lowerCity === 'fpo' || lowerCity === 'dpo';
}

const requiredFields = ['street', 'city', 'country', 'state', 'postalCode'];

/*
 * Create schema for addresses
 *
 * @param {object} schema - Schema for a full form, including address definition in definitions
 * @param {boolean} isRequired - If the address is required or not, defaults to false
 * @param {string} addressProperty - The name of the address definition to use from the common
 *   definitions in currentSchema
 */
export function schema(
  currentSchema,
  isRequired = false,
  addressProperty = 'address',
) {
  const addressSchema = currentSchema.definitions[addressProperty];
  return {
    type: 'object',
    required: isRequired ? requiredFields : [],
    properties: {
      ...addressSchema.properties,
      state: {
        title: 'State/Province/Region',
        type: 'string',
        maxLength: 51,
      },
      militaryAddress: {
        type: 'object',
        properties: {
          militaryPostOffice: radioSchema(Object.keys(postOfficeOptions)),
          militaryState: radioSchema(Object.keys(regionOptions)),
        },
      },
      postalCode: {
        type: 'string',
        maxLength: 10,
      },
    },
  };
}

/*
 * Create uiSchema for addresses
 *
 * @param {string} label - Block label for the address
 * @param {boolean} useStreet3 - Show a third line in the address
 * @param {function} isRequired - A function for conditionally setting if an address is required.
 *   Receives formData and an index (if in an array item)
 * @param {boolean} ignoreRequired - Ignore the required fields array, to avoid overwriting form specific
 *   customizations
 */
export function uiSchema(label = 'Address', useStreet3 = false) {
  let fieldOrder = [
    'street',
    'street2',
    'street3',
    'militaryAddress',
    'city',
    'state',
    'postalCode',
  ];
  if (!useStreet3) {
    fieldOrder = fieldOrder.filter(field => field !== 'street3');
  }

  const addressChangeSelector = createSelector(
    ({ formData }) => formData.country,
    ({ formData, path }) => get(path.concat('city'), formData),
    ({ addressSchema }) => addressSchema,
    (currentCountry, city, addressSchema) => {
      const schemaUpdate = {
        properties: addressSchema.properties,
        required: addressSchema.required,
      };

      const country = currentCountry || 'USA';

      let stateList;
      let labelList;
      if (country === 'USA') {
        stateList = usaStates;
        labelList = usaLabels;
      } else if (country === 'CAN') {
        stateList = canProvinces;
        labelList = canLabels;
      } else if (country === 'MEX') {
        stateList = mexStates;
        labelList = mexLabels;
      }

      if (stateList) {
        // We have a list and it’s different, so we need to make schema updates
        if (addressSchema.properties.state.enum !== stateList) {
          const withEnum = set(
            'state.enum',
            stateList,
            schemaUpdate.properties,
          );
          schemaUpdate.properties = set('state.enumNames', labelList, withEnum);
        }

        // We don’t have a state list for the current country, but there’s an enum in the schema
        // so we need to update it
      } else if (addressSchema.properties.state.enum) {
        const withoutEnum = unset('state.enum', schemaUpdate.properties);
        schemaUpdate.properties = unset('state.enumNames', withoutEnum);
      }

      // We constrain the state list when someone picks a city that’s a military base
      if (
        country === 'USA' &&
        isMilitaryCity(city) &&
        schemaUpdate.properties.state.enum !== militaryStates
      ) {
        const withEnum = set(
          'state.enum',
          militaryStates,
          schemaUpdate.properties,
        );
        schemaUpdate.properties = set(
          'state.enumNames',
          militaryLabels,
          withEnum,
        );
      }

      return schemaUpdate;
    },
  );

  return {
    'ui:title': label,
    'ui:options': {
      updateSchema: (formData, addressSchema, addressUiSchema, index, path) => {
        const currentSchema = addressSchema;
        return addressChangeSelector({
          formData,
          addressSchema: currentSchema,
          path,
        });
      },
    },
    'ui:order': fieldOrder,
    street: {
      'ui:title': 'Street address',
      'ui:autocomplete': 'address-line1',
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Please enter a street address',
      },
    },
    street2: {
      'ui:title': 'Street address 2',
      'ui:autocomplete': 'address-line2',
    },
    street3: {
      'ui:title': 'Street address 3',
      'ui:autocomplete': 'address-line3',
    },
    militaryAddress: {
      'ui:options': {
        hideIf: form => !form.onBaseOutsideUS,
      },
      militaryPostOffice: {
        ...radioUI({
          title: addressFields.POST_OFFICE,
          labels: postOfficeOptions,
        }),
        'ui:required': form => form.onBaseOutsideUS,
      },
      militaryState: {
        ...radioUI({
          title: addressFields.MILITARY_STATE,
          labels: regionOptions,
        }),
        'ui:required': form => form.onBaseOutsideUS,
      },
    },
    city: {
      'ui:title': 'City',
      'ui:autocomplete': 'address-level2',
      'ui:errorMessages': {
        required: 'Please enter a city',
      },
      'ui:required': form => !form.onBaseOutsideUS,
      'ui:options': {
        hideIf: form => form.onBaseOutsideUS,
      },
    },
    state: {
      'ui:errorMessages': {
        required: 'Please enter a state/province/region',
        'ui:autocomplete': 'address-level1',
      },
      'ui:required': form => !form.onBaseOutsideUS,
      'ui:options': {
        hideIf: form => form.onBaseOutsideUS,
      },
    },
    postalCode: {
      'ui:title': 'Postal code',
      'ui:autocomplete': 'postal-code',
      'ui:required': () => true,
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
      },
      'ui:errorMessages': {
        required: 'Please enter a postal code',
        pattern:
          'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
      },
    },
  };
}

export const addressPageUISchema = uiSchema('');
export const addressPageSchema = schema(fullSchema, true).properties;
