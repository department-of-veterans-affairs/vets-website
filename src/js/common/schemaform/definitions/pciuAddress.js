import PCIUAddressField from '../fields/PCIUAddressField';
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

const isMilitaryMailingAddress = (formData) => {
  return formData.veteran.mailingAddress.type === 'MILITARY';
};

const isMilitaryForwardingAddress = (formData) => {
    debugger;
  return formData.veteran['view:hasForwardingAddress'] && (formData.veteran.formData.veteran.forwardingAddress['view:ForwardingAddress'].type === 'MILITARY');
};

const isNotMilitaryMailingAddress = (formData) => {
  return !formData.veteran.mailingAddress.type === 'MILITARY';
};

const isNotMilitaryForwardingAddress = (formData) => {
  debugger;
  return formData.veteran['view:hasForwardingAddress'] && (formData.veteran.formData.veteran.forwardingAddress['view:ForwardingAddress'].type !== 'MILITARY');
};

const isDomesticMailingAddress = (formData) => {
  return formData.veteran.mailingAddress.type === 'DOMESTIC';
};

const isDomesticForwardingAddress = (formData) => {
  return formData.veteran['view:hasForwardingAddress'] && (formData.veteran.formData.veteran.forwardingAddress['view:ForwardingAddress'].type === 'DOMESTIC');
};

const addressLine1MailingAddress = () => {
  return true;
};

const addressLine1ForwardingAddress = (formData) => {
  return !!formData.veteran['view:hasForwardingAddress'] && true;
};

// PCIU states and countries
// TODO are these variables and helpers being used?
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
export const pciuAddressUISchema = (addressName, title) => {


  const domesticValidation = title ? isDomesticForwardingAddress : isDomesticMailingAddress;
  const addressLine1Validation = title ? addressLine1ForwardingAddress : addressLine1MailingAddress;
  const militaryValidation = title ? isMilitaryForwardingAddress : isMilitaryMailingAddress;
  const notMilitaryValidation = title ? isNotMilitaryForwardingAddress : isNotMilitaryMailingAddress;

  return {
    'ui:title': title,
    type: {
      'ui:options': {
        hideIf: () => true
      }
    },
    country: {
      'ui:title': 'Country',
    },
    addressLine1: {
      'ui:title': 'Street',
      'ui:errorMessages': {
        "^([a-zA-Z0-9\\-'.,,&#]([a-zA-Z0-9\\-'.,,&# ])?)+$": "Please only use letters, numbers, and the special characters -'.,,&#"
      },
    },
    addressLine2: {
      'ui:title': 'Line 2',
      'ui:errorMessages': {
        "^([a-zA-Z0-9\\-'.,,&#]([a-zA-Z0-9\\-'.,,&# ])?)+$": "Please only use letters, numbers, and the special characters -'.,,&#"
      },
    },
    addressLine3: {
      'ui:title': 'Line 3',
      'ui:errorMessages': {
        "^([a-zA-Z0-9\\-'.,,&#]([a-zA-Z0-9\\-'.,,&# ])?)+$": "Please only use letters, numbers, and the special characters -'.,,&#"
      },
    },
    city: {
      'ui:title': 'Country',
    },
    state: {
            'ui:title': 'Country',
      'ui:validations': [domesticValidation]
    },
    zipCode: {
      'ui:errorMessages': {
        '^\\d{5}(?:[-\\s]\\d{4})?$': 'Please enter a valid 5 or 9 digit ZIP code (dashes allowed)'
      },
      'ui:validations': [domesticValidation]
    },
    militaryPostOfficeTypeCode: {
            'ui:title': 'Country',
      'ui:options': {
        hideIf: () => true
      }
    },
    militaryStateCode: {
            'ui:title': 'Country',
      'ui:validations': [militaryValidation]
    },
    'ui:field': PCIUAddressField,
  };
};
