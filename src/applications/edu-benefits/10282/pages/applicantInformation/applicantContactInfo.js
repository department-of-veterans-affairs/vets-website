import React from 'react';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';

const { usaPhone, email } = fullSchema10282.definitions;

const uiTitle = (
  <h3 className="vads-u-margin--0 vads-u-color--base">
    {' '}
    Phone and email address
  </h3>
);
export const uiSchema = {
  contactInfo: {
    'ui:title': uiTitle,
    email: {
      'ui:title': 'Email address',
      'ui:webComponentField': VaTextInputField,
      'ui:errorMessages': {
        format:
          'Enter a valid email address using the format email@domain.com. Your email address can only have letters, numbers, the @ symbol and a period, with no spaces.',
        pattern:
          'Enter a valid email address using the format email@domain.com. Your email address can only have letters, numbers, the @ symbol and a period, with no spaces.',
        required: 'Please enter an email address',
      },
    },
    mobilePhone: {
      ...phoneUI('Mobile phone number'),
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        classNames: 'vads-u-margin-top--4',
      },
    },
    homePhone: {
      ...phoneUI('Home phone number'),
      'ui:webComponentField': VaTextInputField,
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
