import { countries, states50AndDC } from './constants';
import emailUI from 'platform/forms-system/src/js/definitions/email';

export const schema = {
  addressInformation: {
    type: 'object',
    properties: {
      countryName: {
        type: 'string',
        enum: countries.map(country => country.value),
        enumNames: countries.map(country => country.label),
      },
      addressLine1: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        pattern: '^.*\\S.*',
      },
      addressLine2: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        pattern: '^.*\\S.*',
      },
      addressLine3: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        pattern: '^.*\\S.*',
      },
      city: {
        type: 'string',
      },
      stateCode: {
        type: 'string',
        enum: states50AndDC.map(state => state.value),
        enumNames: states50AndDC.map(state => state.label),
      },
      zipCode: {
        type: 'string',
        pattern: '^\\d{5}$',
      },
      emailAddress: {
        type: 'string',
      },
      'view:confirmEmail': {
        type: 'string',
      },
      homePhone: {
        type: 'string',
        pattern: '\\(?\\d{3}\\)?-?\\d{3}-?\\d{4}$',
      },
      mobilePhone: {
        type: 'string',
        pattern: '\\(?\\d{3}\\)?-?\\d{3}-?\\d{4}$',
      },
    },
  },
};

export const uiSchema = {
  addressInformation: {
    countryName: {
      'ui:title': 'Country',
      'ui:required': () => {
        return true;
      },
    },
    addressLine1: {
      'ui:title': 'Street Address',
    },
    addressLine2: {
      'ui:title': 'Line 2',
    },
    addressLine3: {
      'ui:title': 'Line 3',
    },
    city: {
      'ui:title': 'City',
      'ui:required': () => {
        return true;
      },
    },
    stateCode: {
      'ui:title': 'State',
      'ui:required': () => {
        return true;
      },
    },
    zipCode: {
      'ui:title': 'Zip Code',
      'ui:required': () => {
        return true;
      },
    },
    emailAddress: emailUI(),
    'view:confirmEmail': {
      'ui:required': formData =>
        formData.addressInformation?.emailAddress !== undefined,
      'ui:validations': [
        (errors, fieldData, formData) => {
          if (formData?.emailAddress !== formData['view:confirmEmail']) {
            errors.addError('Please ensure your emails match');
          }
        },
      ],
      'ui:title': 'Confirm email address',
    },
    homePhone: {
      'ui:title': 'Home telephone number',
      'ui:required': () => {
        return true;
      },
    },
    mobilePhone: {
      'ui:title': 'Mobile telephone number',
      'ui:description':
        '(You may be able to schedule your vaccination appointment by text message. We will need your mobile number to do this.)',
    },
  },
};
