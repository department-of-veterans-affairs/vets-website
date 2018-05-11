import PCIUAddressField from '../fields/PCIUAddressField';

import { pciuStates, militaryStateCodes, pciuCountries, ADDRESS_TYPES } from '../../../../platform/forms/address';

const { domestic, military } = ADDRESS_TYPES;
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
        hideIf: formData => formData.veteran[addressName] && formData.veteran[addressName].type === military
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
      'ui:options': {
        labels: pciuStates,
        hideIf: formData => formData.veteran[addressName] && formData.veteran[addressName].type !== domestic
      }
    },
    zipCode: {
      'ui:title': 'ZIP code',
      'ui:errorMessages': {
        pattern: 'Please enter a valid 5 or 9 digit ZIP code (dashes allowed)'
      },
      'ui:options': {
        hideIf: formData => formData.veteran[addressName] && formData.veteran[addressName].type !== domestic
      }
    },
    militaryPostOfficeTypeCode: {
      'ui:title': 'City (or APO/FPO/DPO)',
      'ui:options': {
        hideIf: formData => !formData.veteran[addressName] || formData.veteran[addressName].type !== military
      }
    },
    militaryStateCode: {
      'ui:title': 'State (or AA/AE/AP)',
      'ui:options': {
        labels: militaryStateCodes,
        hideIf: formData => !formData.veteran[addressName] || formData.veteran[addressName].type !== military
      }
    },
    'ui:field': PCIUAddressField
  };
};
