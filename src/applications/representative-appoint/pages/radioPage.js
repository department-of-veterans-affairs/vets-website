import {
  radioSchema,
  radioUI,
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const typeOfPhoneOptions = Object.freeze({
  CELL: 'Cell',
  HOME: 'Home',
  WORK: 'Work',
});

/** @type {PageSchema} */
export const uiSchema = {
  title: 'Contact information',
  path: 'contact-information',
  uiSchema: {
    ...titleUI('Contact information'),

    typeOfPhone: radioUI({
      title: 'Type of phone',
      labels: typeOfPhoneOptions,
    }),
    canReceiveTexts: yesNoUI('Can this number receive text messages?'),
  },
};

export const schema = {
  schema: {
    type: 'object',
    properties: {
      typeOfPhone: radioSchema(Object.keys(typeOfPhoneOptions)),
      canReceiveTexts: yesNoSchema,
    },
    required: ['phone', 'typeOfPhone', 'canReceiveTexts'],
  },
};
