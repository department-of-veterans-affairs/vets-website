import {
  phoneUI,
  phoneSchema,
  emailUI,
  emailSchema,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const blankSchema = { type: 'object', properties: {} };

export const uiSchema = {
  ...titleUI('Veteran’s phone number and email address'),
  Primary: phoneUI({
    required: true,
  }),
  veteranEmail: emailUI(),
};

export const schema = {
  type: 'object',
  required: ['veteranPhone'],
  properties: {
    titleSchema,
    'Primary phone': phoneSchema,
    veteranEmail: emailSchema,
  },
};
