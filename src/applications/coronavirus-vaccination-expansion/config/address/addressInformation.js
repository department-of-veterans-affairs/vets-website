import emailUI from 'platform/forms-system/src/js/definitions/email';
import { addressInformation } from '../schema-imports';

export const schema = {
  addressInformation,
};

export const uiSchema = {
  addressInformation: {
    countryName: {
      'ui:title': 'Country',
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
    },
    stateCode: {
      'ui:title': 'State',
    },
    zipCode: {
      'ui:title': 'Zip Code',
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
    },
    mobilePhone: {
      'ui:title': 'Mobile telephone number',
      'ui:description':
        '(You may be able to schedule your vaccination appointment by text message. We will need your mobile number to do this.)',
    },
  },
};
