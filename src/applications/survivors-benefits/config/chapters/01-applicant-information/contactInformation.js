import {
  emailSchema,
  emailUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

const { internationalPhone } = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  title: 'Contact information',
  path: 'applicant/contact',
  uiSchema: {
    ...titleUI('Email address and phone number'),
    email: emailUI('Email'),
    phone: phoneUI('Telephone number'),
    mobilePhone: phoneUI('Mobile number'),
    internationalPhone: {
      'ui:title': 'International phone number',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        classNames: 'vads-u-margin-bottom--2',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['email', 'mobilePhone'],
    properties: {
      email: emailSchema,
      phone: phoneSchema,
      mobilePhone: phoneSchema,
      internationalPhone,
    },
  },
};
