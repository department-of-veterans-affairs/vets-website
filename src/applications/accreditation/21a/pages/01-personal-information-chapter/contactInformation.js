import {
  emailSchema,
  emailUI,
  phoneSchema,
  phoneUI,
  radioSchema,
  radioUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

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
    phone: phoneUI('Primary number'),
    typeOfPhone: radioUI({
      title: 'Type of phone',
      labels: typeOfPhoneOptions,
    }),
    email: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      phone: phoneSchema,
      typeOfPhone: radioSchema(Object.keys(typeOfPhoneOptions)),
      email: emailSchema,
    },
    required: ['phone', 'email'],
  },
};
