import React from 'react';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';

const { usaPhone, email } = fullSchema10282.definitions;

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
        email,
        mobilePhone: usaPhone,
        homePhone: usaPhone,
      },
    },
  },
};
