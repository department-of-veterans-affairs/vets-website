import React from 'react';
import {
  addressUI,
  addressSchema,
  phoneUI,
  emailUI,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import AutoSaveNotice from '../../components/AutoSaveNotice';

export default {
  uiSchema: {
    'ui:description': (
      <>
        <AutoSaveNotice />
        <h3 className="vads-u-margin-top--0">Your mailing address</h3>
      </>
    ),
    mailingAddress: addressUI({
      omit: ['isMilitary', 'street3'],
      labels: {
        country: 'Country',
        street: 'Street address',
        street2: 'Street address line 2',
        city: 'City',
        state: 'State or territory',
        postalCode: 'Postal code',
      },
      errorMessages: {
        required: 'Enter your mailing address',
        country: 'Select a country',
        street: 'Enter a street address',
        city: 'Enter a city',
        state: 'Select a state or territory',
        postalCode: 'Enter a postal code',
      },
    }),
    'view:contactHeading': {
      'ui:description': <h3>Your contact details</h3>,
    },
    phoneNumber: phoneUI({
      title: 'Phone number',
      required: () => true,
      errorMessages: {
        required: 'Enter a 10-digit phone number (you can include +1 or 1)',
        pattern: 'Enter a valid U.S. phone number',
      },
      // Accept formats: 1234567890, 11234567890, +11234567890
      // We normalize (strip +1/1) on blur via custom attribute handler if platform later supports.
    }),
    emailAddress: emailUI({
      title: 'Email address',
      required: () => true, // changed from boolean to function
      errorMessages: { required: 'Enter an email address' },
    }),
    'view:contactHelp': {
      'ui:description': (
        <va-additional-info trigger="Why we ask for your contact details">
          <p className="vads-u-margin-top--0">
            If we need more information about your application, we’ll contact
            you by phone.
          </p>
          <p className="vads-u-margin-bottom--0">
            We’ll send you an email confirming that you’ve submitted your
            application.
          </p>
        </va-additional-info>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      mailingAddress: addressSchema({ omit: ['isMilitary', 'street3'] }),
      'view:contactHeading': { type: 'object', properties: {} },
      phoneNumber: {
        type: 'string',
        pattern: '^(?:\\+?1)?\\d{10}$',
        title: 'Phone number',
      },
      emailAddress: emailSchema,
      'view:contactHelp': { type: 'object', properties: {} },
    },
    required: ['mailingAddress', 'phoneNumber', 'emailAddress'],
  },
};
