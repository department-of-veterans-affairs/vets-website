import React from 'react';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import { addressInformation } from '../schema-imports';

export const schema = {
  addressInformation,
};

export const uiSchema = {
  addressInformation: {
    addressLine1: {
      'ui:title': 'U.S. street address where you live now',
    },
    addressLine2: {
      'ui:title': 'U.S. street address (line 2)',
    },
    addressLine3: {
      'ui:title': 'U.S. street address (line 3)',
    },
    city: {
      'ui:title': 'U.S. city',
    },
    stateCode: {
      'ui:title': 'U.S. state or territory',
    },
    zipCode: {
      'ui:title': 'U.S. zip code',
      'ui:errorMessages': {
        pattern: 'Please enter your five digit zip code',
      },
    },
    emailAddress: {
      ...emailUI(),
      'ui:description': (
        <p>
          <strong>Note: </strong>
          If you provide an email address, we can send you information about the
          vaccine process.
        </p>
      ),
    },
    phone: {
      'ui:title': 'U.S. phone number',
      'ui:description': (
        <p>
          <strong>Note: </strong>
          We'll use this number to contact you about a vaccine. If you give us
          your mobile phone number, we may be able to schedule your vaccine
          appointment by text message.
        </p>
      ),
      'ui:errorMessages': {
        pattern: 'Please enter your area code and phone number',
      },
    },
    smsAcknowledgement: {
      'ui:title':
        'I authorize VA to send me text messages about my health care. This includes text messages to schedule a vaccine appointment.',
    },
  },
};
