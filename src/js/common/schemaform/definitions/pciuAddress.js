import PCIUAddress from '../fields/PCIUAddressField';
import { countries, pciuCountries, states, statesOnlyInPCIU, isValidUSZipCode, isValidSpecialCharacter } from '../../../../platform/forms/address';

export const stateRequiredCountries = new Set(['USA', 'CAN', 'MEX']);

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

// PCIU Validations

function validateSpecialCharacter(errors, string) {
  if (string && !isValidSpecialCharacter(string)) {
    errors.addError(
      "Please only use letters, numbers, and the special characters #%&'()+,./:@"
    );
  }
}

function validateZIP(errors, zip) {
  if (zip && !isValidUSZipCode(zip)) {
    errors.addError('Please enter a valid 5 or 9 digit ZIP (dashes allowed)');
  }
}

// PCIU helpers
export const mergeUniques = (first, second) => {
  const result = [];
  let firstPointer = 0;
  let secondPointer = 0;

  while (result.length < (first.length + second.length)) {
    if (!second[secondPointer] || first[firstPointer] < second[secondPointer]) {
      result.push(first[firstPointer]);
      firstPointer++;
    } else {
      result.push(second[secondPointer]);
      secondPointer++;
    }
  }
  return result;
};

// PCIU states and countries
const pciuAllStates = mergeUniques(states.USA, statesOnlyInPCIU);
const pciuStates = pciuAllStates.map(state => state.value);
const pciuStateLabels = pciuAllStates.map(state => state.label);
const militaryPostOfficeTypeCodes = ['APO', 'DPO', 'FPO'];


// PCIU schemas
/*
 * Create uiSchema for PCIU addresses
 *
 * @param {string} addressName - Property name for the address
 * @param {string} title - Block label for the address
 */
export const pciuAddressUISchema = (addressName, title, specialCharacterValidations = []) => {

  const allSpecialCharacterValidations = [validateSpecialCharacter].concat(specialCharacterValidations);
  function validateCity(errors, city, { veteran }) {
    const isMilitaryState = veteran[addressName].militaryPostOfficeTypeCode;
    if (city && isMilitaryState && !militaryPostOfficeTypeCodes.includes(city)) {
      errors.addError(
        'Please enter APO, FPO, or DPO'
      );
    }
  }

  return {
    'ui:title': title,
    //'ui:order': ['country', 'addressLine1', 'addressLine2', 'addressLine3', 'city', 'state', 'militaryPostOfficeTypeCode', 'militaryStateCode', 'zipCode'],
    country: {
      'ui:title': 'Country'
    },
    addressLine1: {
      'ui:title': 'Street',
      'ui:validations': allSpecialCharacterValidations,
    },
    addressLine2: {
      'ui:title': 'Line 2',
      'ui:validations': allSpecialCharacterValidations,
    },
    addressLine3: {
      'ui:title': 'Line 3',
      'ui:validations': allSpecialCharacterValidations,
    },
    city: {
      'ui:options': {
        hideIf: () => true
      }
    },
    state: {
      'ui:options': {
        labels: pciuStateLabels,
        hideIf: () => true
      }
    },
    militaryStateCode: {
      'ui:options': {
        hideIf: () => true
      }
    },
    zipCode: {
      'ui:title': 'ZIP code',
      'ui:validations': [validateZIP],
      'ui:errorMessages': {
        pattern: 'Please enter a valid 5 or 9 digit ZIP code (dashes allowed)'
      },
      'ui:options': {
        widgetClassNames: 'va-input-medium-large',
      }
    },
    militaryPostOfficeTypeCode: {
      'ui:title': 'Military Post Office Type Code',
      'ui:options': {
        hideIf: () => true
      }
    },
    'ui:field': PCIUAddress,
  };
};


/*
 * Create schema for PCIU addresses
 *
 * @param {boolean} isRequired - If the address is required or not, defaults to false
 */
// TODO: use backend schema
export const pciuAddressSchema = {
  type: 'object',
  required: ['country', 'addressLine1'],
  properties: {
    type: {
      type: 'string',
      'enum': ['MILITARY', 'DOMESTIC', 'INTERNATIONAL']
    },
    country: {
      type: 'string',
      'enum': pciuCountries
    },
    addressLine1: {
      type: 'string',
      maxLength: 35,
      pattern: "([a-zA-Z0-9-'.,,&#]([a-zA-Z0-9-'.,,&# ])?)+$"
    },
    addressLine2: {
      type: 'string',
      maxLength: 35,
      pattern: "([a-zA-Z0-9-'.,,&#]([a-zA-Z0-9-'.,,&# ])?)+$"
    },
    addressLine3: {
      type: 'string',
      maxLength: 35,
      pattern: "([a-zA-Z0-9-'.,,&#]([a-zA-Z0-9-'.,,&# ])?)+$"
    },
    city: {
      type: 'string',
      maxLength: 35,
      pattern: "([a-zA-Z0-9-'.#]([a-zA-Z0-9-'.# ])?)+$"
    },
    state: {
      type: 'string',
    },
    militaryPostOfficeTypeCode: {
      type: 'string',
      'enum': ['APO', 'DPO', 'FPO']
    },
    militaryStateCode: {
      type: 'string',
      'enum': ['AA', 'AE', 'AP']
    },
    zipCode: {
      type: 'string'
    }
  }
};
