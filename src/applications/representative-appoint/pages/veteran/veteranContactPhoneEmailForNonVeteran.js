import {
  phoneUI,
  phoneSchema,
  emailUI,
  emailSchema,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const uiSchema = {
  ...titleUI(() => 'Veteran’s phone number and email address'),
  'Primary phone': phoneUI({
    required: false,
  }),
  veteranEmail: emailUI(),
};

export const schema = {
  type: 'object',
  required: [],
  properties: {
    titleSchema,
    'Primary phone': phoneSchema,
    veteranEmail: emailSchema,
  },
};
