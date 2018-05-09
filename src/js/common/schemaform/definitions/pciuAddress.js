import PCIUAddressField from '../fields/PCIUAddressField';

/*
 * Create uiSchema for PCIU addresses
 *
 * @param {string} addressName - Property name for the address
 * @param {string} title - Block label for the address
 */
export const pciuAddressUISchema = (addressName, title) => {

  return {
    'ui:title': title,
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
    zipCode: {
      'ui:errorMessages': {
        '^\\d{5}(?:[-\\s]\\d{4})?$': 'Please enter a valid 5 or 9 digit ZIP code (dashes allowed)'
      },
    },
    'ui:field': PCIUAddressField,
  };
};
