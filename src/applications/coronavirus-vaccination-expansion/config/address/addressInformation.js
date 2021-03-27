import React from 'react';
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
      'ui:title': 'Street address',
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
      'ui:title': 'Zip code',
      'ui:errorMessages': {
        pattern: 'Please enter your five digit zip code',
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
      'ui:errorMessages': {
        pattern: 'Please enter your area code and phone number',
      },
    },
    mobilePhone: {
      'ui:title': 'Mobile telephone number',
      'ui:description': (
        <p>
          <strong>Note: </strong>
          If you give us your mobile phone number, we may be able to schedule
          your vaccine appointment by text message.
        </p>
      ),
      'ui:errorMessages': {
        pattern: 'Please enter your area code and phone number',
      },
    },
    smsAcknowledgement: {
      'ui:title':
        'I authorize VA to send me text messages about my medical care, such as for appointment scheduling.',
    },
  },
};
