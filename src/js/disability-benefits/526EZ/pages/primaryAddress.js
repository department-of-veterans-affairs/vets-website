import _ from 'lodash';

import fullSchema526EZ from 'vets-json-schema/dist/21-526EZ-schema.json';

import dateUI from '../../../common/schemaform/definitions/date';
import phoneUI from '../../../common/schemaform/definitions/phone';
import { pciuAddressUISchema } from '../definitions/pciuAddress';
import EmailWidget from '../../../common/schemaform/widgets/EmailWidget';

import ReviewCardField from '../components/ReviewCardField';

import { PrimaryAddressViewField, pciuStateValues, pciuStateNames, militaryStateCodes, pciuCountries } from '../helpers';

function isValidPhone(value) {
  if (value !== null) {
    return /^\d{10}$/.test(value);
  }
  return true;
}

function validatePhone(errors, phone) {
  if (phone && !isValidPhone(phone)) {
    errors.addError(
      'Phone numbers must be 10 digits (dashes allowed)'
    );
  }
}

export const hasForwardingAddress = formData => {
  return formData.veteran && !!formData.veteran['view:hasForwardingAddress'];
};

// TODO: replace with updated pciu schema (phone, zipCode)
const addressSchema = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
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
      'enum': pciuStateValues,
      enumNames: pciuStateNames
    },
    zipCode: {
      type: 'string'
    },
    militaryPostOfficeTypeCode: {
      type: 'string',
    },
    militaryStateCode: {
      type: 'string',
      'enum': militaryStateCodes
    }
  }
};

export const uiSchema = {
  veteran: {
    'ui:title': 'Contact information',
    'ui:field': ReviewCardField,
    'ui:options': {
      viewComponent: PrimaryAddressViewField
    },
    mailingAddress: pciuAddressUISchema('mailingAddress'),
    primaryPhone: _.merge(phoneUI('Primary telephone number'), {
      'ui:validations': [validatePhone]
    }),
    emailAddress: {
      'ui:title': 'Email address',
      'ui:widget': EmailWidget
    },
    alternateEmailAddress: {
      'ui:title': 'Alternate email address',
      'ui:widget': EmailWidget
    },
    'view:hasForwardingAddress': {
      'ui:title': 'I want to provide a forwarding address since my address will be changing soon.'
    },
    forwardingAddress: {
      'ui:options': {
        expandUnder: 'view:hasForwardingAddress'
      },
      'view:forwardingAddress': pciuAddressUISchema('forwardingAddress', 'Forwarding address'),
      effectiveDate: _.merge(dateUI('Effective date'), {
        'ui:required': hasForwardingAddress
      })
    }
  }
};

export const primaryAddressSchema = {
  type: 'object',
  properties: {
    veteran: {
      type: 'object',
      properties: {
        mailingAddress: _.merge({}, addressSchema),
        primaryPhone: {
          type: 'string'
        },
        emailAddress: {
          type: 'string',
          format: 'email'
        },
        alternateEmailAddress: {
          type: 'string',
          format: 'email'
        },
        'view:hasForwardingAddress': {
          type: 'boolean'
        },
        forwardingAddress: {
          type: 'object',
          properties: {
            'view:forwardingAddress': _.merge({}, addressSchema),
            effectiveDate: fullSchema526EZ.definitions.date
          }
        }
      }
    }
  }
};

