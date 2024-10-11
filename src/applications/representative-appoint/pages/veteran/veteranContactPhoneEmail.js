import {
  phoneUI,
  phoneSchema,
  emailUI,
  emailSchema,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const uiSchema = {
  ...titleUI(() => 'Your phone number and email address'),
  'Primary phone': phoneUI({
    required: true,
  }),
  veteranEmail: emailUI(),
};

export const schema = {
  type: 'object',
  required: ['Primary phone'],
  properties: {
    titleSchema,
    'Primary phone': phoneSchema,
    veteranEmail: emailSchema,
  },
};
