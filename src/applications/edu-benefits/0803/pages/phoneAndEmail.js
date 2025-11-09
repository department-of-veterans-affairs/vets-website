// @ts-check
import {
  internationalPhoneUI,
  internationalPhoneSchema,
  emailSchema,
  emailUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Phone and email address'),
    mobilePhone: {
      ...internationalPhoneUI('Mobile phone number'),
    },
    homePhone: {
      ...internationalPhoneUI('Home phone number'),
    },
    emailAddress: {
      ...emailUI('Email'),
    },
  },
  schema: {
    type: 'object',
    properties: {
      mobilePhone: internationalPhoneSchema(),
      homePhone: internationalPhoneSchema(),
      emailAddress: emailSchema,
    },
  },
};
