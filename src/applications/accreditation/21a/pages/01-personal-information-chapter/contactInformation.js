import {
  emailSchema,
  emailUI,
  radioSchema,
  radioUI,
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  internationalPhoneSchema,
  internationalPhoneUI,
} from '../helpers/internationalPhonePatterns';

const typeOfPhoneOptions = {
  CELL: 'Cell',
  HOME: 'Home',
  WORK: 'Work',
};

/** @type {PageSchema} */
export default {
  title: 'Contact information',
  path: 'contact-information',
  uiSchema: {
    ...titleUI('Contact information'),
    phone: internationalPhoneUI('Primary number'),
    typeOfPhone: radioUI({
      title: 'Type of phone',
      labels: typeOfPhoneOptions,
    }),
    canReceiveTexts: yesNoUI('Can this number receive text messages?'),
    email: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      phone: internationalPhoneSchema,
      typeOfPhone: radioSchema(Object.keys(typeOfPhoneOptions)),
      canReceiveTexts: yesNoSchema,
      email: emailSchema,
    },
    required: ['phone', 'typeOfPhone', 'canReceiveTexts', 'email'],
  },
};
