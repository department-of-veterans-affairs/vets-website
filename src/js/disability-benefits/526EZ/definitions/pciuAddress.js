import PCIUAddressField from '../fields/PCIUAddressField';

import { pciuStates, militaryStateCodes, pciuCountries } from '../../../../platform/forms/address';

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
      'city', 'state', 'zipCode', 'militaryPostOfficeTypeCode', 'militaryStateCode'],
    country: {
      'ui:title': 'Country',
      'ui:options': {
        labels: pciuCountries,
        hideIf: formData => formData.veteran[addressName] && formData.veteran[addressName].type === 'MILITARY'
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
        hideIf: formData => formData.veteran[addressName] && formData.veteran[addressName].type === 'MILITARY'
      }
    },
    state: {
      'ui:title': 'State (or AA/AE/AP)',
      'ui:options': {
        labels: pciuStates,
        hideIf: formData => formData.veteran[addressName] && formData.veteran[addressName].type !== 'DOMESTIC'
      }
    },
    zipCode: {
      'ui:title': 'ZIP code',
      'ui:errorMessages': {
        pattern: 'Please enter a valid 5 or 9 digit ZIP code (dashes allowed)'
      },
      'ui:options': {
        hideIf: formData => formData.veteran[addressName] && formData.veteran[addressName].type !== 'DOMESTIC'
      }
    },
    militaryPostOfficeTypeCode: {
      'ui:title': 'City (or APO/FPO/DPO)',
      'ui:options': {
        hideIf: formData => !formData.veteran[addressName] || formData.veteran[addressName].type !== 'MILITARY'
      }
    },
    militaryStateCode: {
      'ui:title': 'State (or AA/AE/AP)',
      'ui:options': {
        labels: militaryStateCodes,
        hideIf: formData => !formData.veteran[addressName] || formData.veteran[addressName].type !== 'MILITARY'
      }
    },
    'ui:field': PCIUAddressField
  };
};
