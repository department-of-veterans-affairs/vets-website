import {
  emailSchema,
  emailUI,
  phoneUI,
  phoneSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Phone and email address'),
    survivingDependentPhone: phoneUI('Phone number'),
    survivingDependentInternationalPhone: phoneUI('International phone number'),
    survivingDependentEmail: emailUI('Email address'),
  },
  schema: {
    type: 'object',
    properties: {
      survivingDependentPhone: phoneSchema,
      survivingDependentInternationalPhone: phoneSchema,
      survivingDependentEmail: emailSchema,
    },
    required: ['survivingDependentPhone'],
  },
};
