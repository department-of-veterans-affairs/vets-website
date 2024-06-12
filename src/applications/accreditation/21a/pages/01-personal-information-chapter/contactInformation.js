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
    personalPhone: phoneUI('Primary number'),
    typeOfPhone: radioUI({
      title: 'Type of phone',
      labels: typeOfPhoneOptions,
    }),
    personalEmail: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      personalPhone: phoneSchema,
      typeOfPhone: radioSchema(Object.keys(typeOfPhoneOptions)),
      personalEmail: emailSchema,
    },
    required: ['personalPhone', 'personalEmail'],
  },
};
