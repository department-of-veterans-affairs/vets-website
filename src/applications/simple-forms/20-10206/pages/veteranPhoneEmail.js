import {
  emailSchema,
  emailUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Phone and email address'),
    veteranHomePhone: phoneUI('Home phone number'),
    veteranInternationalPhone: phoneUI('Mobile phone number'),
    veteranEmailAddress: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      veteranHomePhone: phoneSchema,
      veteranInternationalPhone: phoneSchema,
      veteranEmailAddress: emailSchema,
    },
    required: ['veteranHomePhone'],
  },
};
