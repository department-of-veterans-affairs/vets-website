import React from 'react';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';

const uiTitle = <h3> Phone and Email Address</h3>;
export const uiSchema = {
  'ui:title': uiTitle,
  contactInfo: {
    email: {
      'ui:title': 'Email address?',
      'ui:webComponentField': VaTextInputField,
    },
    mobilePhone: {
      'ui:title': 'Email address?',
      ...phoneUI('Mobile phone number'),
      'ui:options': {
        classNames: 'vads-u-margin-top--4',
      },
    },
    homePhone: {
      'ui:title': 'Home phone number',
      ...phoneUI('Home phone number'),
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    contactInfo: {
      type: 'object',
      required: ['email'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
        },
        mobilePhone: {
          type: 'string',
          pattern: '^[0-9]{10}$',
        },
        homePhone: {
          type: 'string',
          pattern: '^[0-9]{10}$',
        },
      },
    },
  },
};
