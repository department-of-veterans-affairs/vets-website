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
} from 'platform/forms-system/src/js/web-component-patterns/internationalPhonePattern';

import { typeOfPhoneOptions } from '../../constants/options';

/** @type {PageSchema} */
export default {
  title: 'Contact information',
  path: 'contact-information',
  uiSchema: {
    ...titleUI('Contact information'),
    phone: internationalPhoneUI({
      title: 'Primary phone number',
      hint: 'Enter with dashes and no spaces. For example: 206-555-0100',
    }),
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
      phone: internationalPhoneSchema(),
      typeOfPhone: radioSchema(Object.keys(typeOfPhoneOptions)),
      canReceiveTexts: yesNoSchema,
      email: emailSchema,
    },
    required: ['phone', 'typeOfPhone', 'canReceiveTexts', 'email'],
  },
};
