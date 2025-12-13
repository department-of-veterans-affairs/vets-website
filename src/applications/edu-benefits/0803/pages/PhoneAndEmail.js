// @ts-check
import {
  internationalPhoneUI,
  internationalPhoneSchema,
  emailSchema,
  emailUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
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
};
const schema = {
  type: 'object',
  properties: {
    mobilePhone: internationalPhoneSchema(),
    homePhone: internationalPhoneSchema(),
    emailAddress: emailSchema,
  },
};

export { schema, uiSchema };
