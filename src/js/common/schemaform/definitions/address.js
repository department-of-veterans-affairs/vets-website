import _ from 'lodash/fp';
import { createSelector } from 'reselect';

import { countries, states } from '../../utils/options-for-select';
import { validateAddress } from '../validation';

const countryValues = countries.map(object => object.value);
const countryNames = countries.map(object => object.label);
const militaryStates = states.USA
  .filter(state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA')
  .map(state => state.value);
const militaryLabels = states.USA
  .filter(state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA')
  .map(state => state.label);
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

const requiredFields = ['street', 'city', 'country', 'postalCode'];
export function schema(currentSchema, isRequired = false) {
  return {
    type: 'object',
    required: isRequired ? requiredFields : [],
    properties: _.assign(currentSchema.definitions.address.properties, {
      country: {
        'default': 'USA',
        type: 'string',
        'enum': countryValues,
        enumNames: countryNames
      },
      state: {
        title: 'State',
        type: 'string',
        maxLength: 51
      },
      postalCode: {
        type: 'string',
        maxLength: 10
      }
    })
  };
}

/*
 * Create uiSchema for addresses
 *
 * @param {string} label - Block label for the address
 * @param {boolean} useStreet3 - Show a third line in the address
 * @param {function} isRequired - A function for conditionally setting if an address is required.
 *   Receives formData and an index (if in an array item)
 */
export function uiSchema(label = 'Address', useStreet3 = false, isRequired = null) {
  let fieldOrder = ['country', 'street', 'street2', 'street3', 'city', 'state', 'postalCode'];
  if (!useStreet3) {
    fieldOrder = fieldOrder.filter(field => field !== 'street3');
  }

  const addressChangeSelector = createSelector(
    ({ formData, path }) => _.get(path.concat('country'), formData),
    ({ formData, path }) => _.get(path.concat('city'), formData),
    _.get('addressSchema'),
    (currentCountry, city, addressSchema) => {
      const schemaUpdate = {
        properties: addressSchema.properties,
        required: addressSchema.required
      };
      const country = currentCountry || addressSchema.properties.country.default;
      const required = addressSchema.required.length > 0;

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
        // We have a list and it's different, so we need to make schema updates
        if (addressSchema.properties.state.enum !== stateList) {
          const withEnum = _.set('state.enum', stateList, schemaUpdate.properties);
          schemaUpdate.properties = _.set('state.enumNames', labelList, withEnum);

          // all the countries with state lists require the state field, so add that if necessary
          if (required && !addressSchema.required.some(field => field === 'state')) {
            schemaUpdate.required = addressSchema.required.concat('state');
          }
        }
      // We don't have a state list for the current country, but there's an enum in the schema
      // so we need to update it
      } else if (addressSchema.properties.state.enum) {
        const withoutEnum = _.unset('state.enum', schemaUpdate.properties);
        schemaUpdate.properties = _.unset('state.enumNames', withoutEnum);
        if (required) {
          schemaUpdate.required = addressSchema.required.filter(field => field !== 'state');
        }
      }

      // Canada has a different title than others, so set that when necessary
      if (country === 'CAN' && addressSchema.properties.state.title !== 'Province') {
        schemaUpdate.properties = _.set('state.title', 'Province', schemaUpdate.properties);
      } else if (country !== 'CAN' && addressSchema.properties.state.title !== 'State') {
        schemaUpdate.properties = _.set('state.title', 'State', schemaUpdate.properties);
      }

      // We constrain the state list when someone picks a city that's a military base
      if (country === 'USA' && isMilitaryCity(city) && schemaUpdate.properties.state.enum !== militaryStates) {
        const withEnum = _.set('state.enum', militaryStates, schemaUpdate.properties);
        schemaUpdate.properties = _.set('state.enumNames', militaryLabels, withEnum);
      }

      return schemaUpdate;
    }
  );

  return {
    'ui:title': label,
    'ui:validations': [
      validateAddress
    ],
    'ui:options': {
      updateSchema: (formData, addressSchema, addressUiSchema, index, path) => {
        let currentSchema = addressSchema;
        if (isRequired) {
          const required = isRequired(formData, index);
          if (required && currentSchema.required.length === 0) {
            currentSchema = _.set('required', requiredFields, currentSchema);
          } else if (!required && currentSchema.required.length > 0) {
            currentSchema = _.set('required', [], currentSchema);
          }
        }
        return addressChangeSelector({
          formData,
          addressSchema: currentSchema,
          path
        });
      }
    },
    'ui:order': fieldOrder,
    country: {
      'ui:title': 'Country'
    },
    street: {
      'ui:title': 'Street'
    },
    street2: {
      'ui:title': 'Line 2'
    },
    street3: {
      'ui:title': 'Line 3'
    },
    city: {
      'ui:title': 'City'
    },
    state: {},
    postalCode: {
      'ui:title': 'Postal code',
      'ui:options': {
        widgetClassNames: 'usa-input-medium'
      }
    }
  };
}
