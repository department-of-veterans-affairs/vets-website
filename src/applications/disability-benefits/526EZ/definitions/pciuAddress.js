import _ from 'lodash/fp';
import PCIUAddressField from '../fields/PCIUAddressField';

import { pciuStates, pciuStateValues, pciuStateNames, militaryStateCodes, pciuCountries, ADDRESS_TYPES, militaryPostOfficeTypeCodes } from '../helpers';

const { domestic, military, international } = ADDRESS_TYPES;
/*
 * Create uiSchema for PCIU addresses
 *
 * @param {string} addressName - Property name for the address
 * @param {string} title - Block label for the address
 */
export const pciuAddressUISchema = (addressName, title) => {
  return {
    'ui:title': title,
    'ui:order': ['country', 'addressLine1', 'addressLine2', 'addressLine3',
      'city', 'state', 'militaryPostOfficeTypeCode', 'militaryStateCode', 'zipCode'],
    'ui:options': {
      updateSchema: (formData, schema) => {
        let newSchema = Object.assign({}, schema);
        const address = formData.veteran[addressName];
        if (!address) return schema;
        const { city, militaryPostOfficeTypeCode, state, militaryStateCode } = address;
        const cityValue = city || militaryPostOfficeTypeCode;
        const stateValue = state || militaryStateCode;
        if (address && militaryPostOfficeTypeCodes.includes(_.upperCase(cityValue)) && !stateValue) {
          newSchema.properties.militaryStateCode.enum = militaryStateCodes;
          newSchema = _.unset('properties.militaryStateCode.enumNames', newSchema);
        } else {
          newSchema.properties.militaryStateCode.enum = pciuStateValues;
          newSchema.properties.militaryStateCode.enumNames = pciuStateNames;
        }
        return newSchema;
      }
    },
    country: {
      'ui:title': 'Country',
      'ui:validations': [(errors, fieldData, formData) => {
        const address = formData.veteran[addressName];
        if (address.type === 'MILITARY' && (address.country !== 'USA')) {
          errors.addError('Please select USA for overseas military addresses');
        }
      }],
      'ui:options': {
        labels: pciuCountries
      }
    },
    addressLine1: {
      'ui:title': 'Street',
      'ui:errorMessages': {
        pattern: "Please only use letters, numbers, and the special characters -'.,,&#"
      }
    },
    addressLine2: {
      'ui:title': 'Line 2',
      'ui:errorMessages': {
        pattern: "Please only use letters, numbers, and the special characters -'.,,&#"
      }
    },
    addressLine3: {
      'ui:title': 'Line 3',
      'ui:errorMessages': {
        pattern: "Please only use letters, numbers, and the special characters -'.,,&#"
      }
    },
    city: {
      'ui:title': 'City (or APO/FPO/DPO)',
      'ui:options': {
        hideIf: formData => formData.veteran[addressName] && formData.veteran[addressName].type === military
      }
    },
    state: {
      'ui:title': 'State (or AA/AE/AP)',
      'ui:validations': [(errors, fieldData, formData) => {
        const address = formData.veteran[addressName];
        if (address.type === 'MILITARY' && !militaryStateCodes.includes(address.state)) {
          errors.addError('Please enter AA, AE, or AP');
        }
      }],
      'ui:options': {
        labels: pciuStates,
        hideIf: formData => formData.veteran[addressName] && formData.veteran[addressName].type !== domestic,
      }
    },
    zipCode: {
      'ui:title': 'ZIP code',
      'ui:errorMessages': {
        pattern: 'Please enter a valid 5 or 9 digit ZIP code (dashes allowed)'
      },
      'ui:options': {
        hideIf: formData => formData.veteran[addressName] && formData.veteran[addressName].type === international
      }
    },
    militaryPostOfficeTypeCode: {
      'ui:title': 'City (or APO/FPO/DPO)',
      'ui:validations': [(errors, fieldData, formData) => {
        const address = formData.veteran[addressName];
        if (address.type === 'MILITARY' && !militaryPostOfficeTypeCodes.includes(_.upperCase(address.militaryPostOfficeTypeCode))) {
          errors.addError('Please enter APO, FPO, or DPO');
        }
      }],
      'ui:options': {
        hideIf: formData => !formData.veteran[addressName] || formData.veteran[addressName].type !== military
      }
    },
    militaryStateCode: {
      'ui:title': 'State (or AA/AE/AP)',
      'ui:validations': [(errors, fieldData, formData) => {
        const address = formData.veteran[addressName];
        if (address.type === 'MILITARY' && !militaryStateCodes.includes(address.militaryStateCode)) {
          errors.addError('Please enter AA, AE, or AP');
        }
      }],
      'ui:options': {
        labels: militaryStateCodes,
        hideIf: formData => !formData.veteran[addressName] || formData.veteran[addressName].type !== military
      }
    },
    'ui:field': PCIUAddressField
  };
};
