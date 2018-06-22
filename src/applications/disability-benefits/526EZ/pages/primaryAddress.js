import _ from 'lodash';

import fullSchema526EZ from 'vets-json-schema/dist/21-526EZ-schema.json';
// import fullSchema526EZ from '/path/vets-json-schema/dist/21-526EZ-schema.json';

import dateUI from 'us-forms-system/lib/js/definitions/date';
import PhoneNumberWidget from 'us-forms-system/lib/js/widgets/PhoneNumberWidget';

import ReviewCardField from '../components/ReviewCardField';

import { PrimaryAddressViewField, AddressDescription } from '../helpers';
import  {
  MILITARY_CITIES,
  MILITARY_STATE_LABELS,
  MILITARY_STATE_VALUES,
  STATE_LABELS,
  STATE_VALUES,
  USA
} from '../constants';

function isValidZIP(value) {
  if (value !== null) {
    return /^\d{5}(?:(?:[-\s])?\d{4})?$/.test(value);
  }
  return true;
}

function validateZIP(errors, zip) {
  if (zip && !isValidZIP(zip)) {
    errors.addError('Please enter a valid 9 digit ZIP (dashes allowed)');
  }
}

function validateMilitaryCity(errors, city, formData, schema, messages, options) {
  const isMilitaryState = MILITARY_STATE_VALUES.includes(
    _.get(formData, `veteran[${options.addressName}].state`, '')
  );
  const isMilitaryCity = MILITARY_CITIES.includes(city.trim().toUpperCase());
  if (isMilitaryState && !isMilitaryCity) {
    errors.addError('City must match APO, DPO, or FPO when using a military state code');
  }
}

function validateMilitaryState(errors, state, formData, schema, messages, options) {
  const isMilitaryCity = MILITARY_CITIES.includes(
    _.get(formData, `veteran[${options.addressName}].city`, '').trim().toUpperCase()
  );
  const isMilitaryState = MILITARY_STATE_VALUES.includes(state);
  if (isMilitaryCity && !isMilitaryState) {
    errors.addError('State must be AA, AE, or AP when using a military city');
  }
}

const hasForwardingAddress = (formData) => (_.get(formData, 'veteran[view:hasForwardingAddress]', false));

const addressUISchema = (addressName, title) => {
  const updateStates = (form) => {
    const currentCity = _.get(form, `veteran.${addressName}.city`, '').trim().toUpperCase();
    if (MILITARY_CITIES.includes(currentCity)) {
      return {
        'enum': MILITARY_STATE_VALUES,
        enumNames: MILITARY_STATE_LABELS
      };
    }

    return {
      'enum': STATE_VALUES,
      enumNames: STATE_LABELS
    };
  };

  return {
    'ui:order': [
      'country',
      'addressLine1',
      'addressLine2',
      'addressLine3',
      'city',
      'state',
      'zipCode'
    ],
    'ui:title': title,
    country: {
      'ui:title': 'Country'
    },
    addressLine1: {
      'ui:title': 'Street address'
    },
    addressLine2: {
      'ui:title': 'Street address (optional)'
    },
    addressLine3: {
      'ui:title': 'Street address (optional)'
    },
    city: {
      'ui:title': 'City',
      'ui:validations': [{
        options: { addressName },
        validator: validateMilitaryCity
      }]
    },
    state: {
      'ui:title': 'State',
      'ui:required': ({ veteran }) => (veteran.mailingAddress.country === USA),
      'ui:options': {
        hideIf: ({ veteran }) => (veteran.mailingAddress.country !== USA),
        updateSchema: updateStates
      },
      'ui:validations': [{
        options: { addressName },
        validator: validateMilitaryState
      }]
    },
    zipCode: {
      'ui:title': 'ZIP code',
      'ui:validations': [validateZIP],
      'ui:required': ({ veteran }) => (veteran.mailingAddress.country === USA),
      'ui:errorMessages': {
        pattern: 'Please enter a valid 5- or 9- digit ZIP code (dashes allowed)'
      },
      'ui:options': {
        widgetClassNames: 'va-input-medium-large',
        hideIf: ({ veteran }) => (veteran.mailingAddress.country !== USA)
      }
    },
  };
};

const { mailingAddress, forwardingAddress } = fullSchema526EZ.properties.veteran.properties;

export const uiSchema = {
  veteran: {
    'ui:title': 'Contact information',
    'ui:description': AddressDescription,
    'ui:field': ReviewCardField,
    'ui:options': {
      viewComponent: PrimaryAddressViewField
    },
    'ui:order': [
      'mailingAddress',
      'primaryPhone',
      'emailAddress',
      'view:hasForwardingAddress',
      'forwardingAddress'
    ],
    mailingAddress: addressUISchema('mailingAddress'),
    primaryPhone: {
      'ui:title': 'Primary telephone number',
      'ui:widget': PhoneNumberWidget,
      'ui:errorMessages': {
        pattern: 'Phone numbers must be 10 digits (dashes allowed)'
      },
      'ui:options': {
        widgetClassNames: 'va-input-medium-large'
      }
    },
    emailAddress: {
      'ui:title': 'Email address',
      'ui:errorMessages': {
        pattern: 'Please put your email in this format x@x.xxx'
      }
    },
    'view:hasForwardingAddress': {
      'ui:title':
        'I want to provide a forwarding address since my address will be changing soon.'
    },
    forwardingAddress: _.merge(
      addressUISchema('forwardingAddress', 'Forwarding address'),
      {
        'ui:options': {
          expandUnder: 'view:hasForwardingAddress'
        },
        'ui:order': [
          'effectiveDate',
          'country',
          'addressLine1',
          'addressLine2',
          'addressLine3',
          'city',
          'state',
          'zipCode'
        ],
        effectiveDate: _.merge(
          {},
          dateUI('Effective date'),
          { 'ui:required': hasForwardingAddress }
        ),
        country: {
          'ui:required': hasForwardingAddress,

        },
        addressLine1: {
          'ui:required': hasForwardingAddress
        },
        city: {
          'ui:required': hasForwardingAddress
        },
        state: {
          'ui:required': (formData) => (
            hasForwardingAddress(formData)
            && formData.veteran.forwardingAddress.country === USA
          ),
          'ui:options': {
            hideIf: (formData) => (
              hasForwardingAddress(formData)
              && formData.veteran.forwardingAddress.country !== USA)
          }
        },
        zipCode: {
          'ui:required': (formData) => (
            hasForwardingAddress(formData)
            && formData.veteran.forwardingAddress.country === USA
          ),
          'ui:options': {
            hideIf: (formData) => (
              hasForwardingAddress(formData)
              && formData.veteran.forwardingAddress.country !== USA)
          }
        }
      }
    )
  }
};

export const primaryAddressSchema = {
  type: 'object',
  properties: {
    veteran: {
      type: 'object',
      properties: {
        mailingAddress,
        primaryPhone: {
          type: 'string',
          pattern: '^\\d{10}$'
        },
        emailAddress: {
          type: 'string',
          format: 'email'
        },
        'view:hasForwardingAddress': {
          type: 'boolean'
        },
        forwardingAddress
      }
    }
  }
};
