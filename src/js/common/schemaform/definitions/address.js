import _ from 'lodash/fp';
import { createSelector } from 'reselect';

import { countries, states } from '../../utils/options-for-select';
import { validateAddress } from '../validation';

/*
 * These are schema definitions for some common form fields
 */
const countryValues = countries.map(object => object.value);
const countryNames = countries.map(object => object.label);
const militaryStates = states.USA
  .filter(state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA')
  .map(state => state.value);
const usaStates = states.USA.map(state => state.value);
const canProvinces = states.CAN.map(state => state.value);
const mexStates = states.MEX.map(state => state.value);
const stateLabels = [...states.USA, ...states.CAN, ...states.MEX]
  .reduce((labels, state) => {
    labels[state.value] = state.label; // eslint-disable-line no-param-reassign
    return labels;
  }, {});

function isMilitaryCity(city = '') {
  const lowerCity = city.toLowerCase().trim();

  return lowerCity === 'apo' || lowerCity === 'fpo' || lowerCity === 'dpo';
}

export function schema(currentSchema, isRequired = false) {
  return {
    type: 'object',
    required: isRequired ? ['street', 'city', 'country', 'postalCode'] : [],
    properties: _.assign(currentSchema.definitions.address.properties, {
      country: {
        'default': 'USA',
        type: 'string',
        'enum': countryValues,
        enumNames: countryNames
      },
      state: {
        title: 'State',
        type: 'string'
      },
      postalCode: {
        type: 'string',
        maxLength: 10
      }
    })
  };
}

export function uiSchema(label = 'Address', useStreet3 = false) {
  let fieldOrder = ['country', 'street', 'street2', 'street3', 'city', 'state', 'postalCode'];
  if (!useStreet3) {
    fieldOrder = fieldOrder.filter(field => field !== 'street3');
  }

  const addressChangeSelector = createSelector(
    ({ formData, path }) => _.get(path.concat('country'), formData),
    ({ formData, path }) => _.get(path.concat('city'), formData),
    _.get('addressSchema'),
    (currentCountry, city, addressSchema) => {
      const schemaUpdate = { properties: addressSchema.properties };
      const country = currentCountry || addressSchema.properties.country.default;
      const isRequired = addressSchema.required.length > 0;

      let stateList;
      if (country === 'USA') {
        stateList = usaStates;
      } else if (country === 'CAN') {
        stateList = canProvinces;
      } else if (country === 'MEX') {
        stateList = mexStates;
      }

      if (stateList) {
        // We have a list and it's different, so we need to make schema updates
        if (addressSchema.properties.state.enum !== stateList) {
          schemaUpdate.properties = _.set('state.enum', stateList, schemaUpdate.properties);

          // all the countries with state lists require the state field, so add that if necessary
          if (isRequired && !addressSchema.required.some(field => field === 'state')) {
            schemaUpdate.required = addressSchema.required.concat('state');
          }
        }
      // We don't have a state list for the current country, but there's an enum in the schema
      // so we need to update it
      } else if (addressSchema.properties.state.enum) {
        schemaUpdate.properties = _.unset('state.enum', schemaUpdate.properties);
        if (isRequired) {
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
        schemaUpdate.properties = _.set('state.enum', militaryStates, schemaUpdate.properties);
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
      updateSchema: (formData, addressSchema, addressUiSchema, index, path) =>
        addressChangeSelector({
          formData,
          addressSchema,
          path
        })
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
    state: {
      'ui:options': {
        labels: stateLabels
      }
    },
    postalCode: {
      'ui:title': 'Postal code',
      'ui:options': {
        widgetClassNames: 'usa-input-medium'
      }
    }
  };
}
