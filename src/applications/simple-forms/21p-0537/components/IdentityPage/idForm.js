import {
  phoneSchema,
  phoneUI,
  emailSchema,
  emailUI,
  fullNameSchema,
  fullNameUI,
} from 'platform/forms-system/src/js/web-component-patterns';

// define ID form schema
export const idFormSchema = {
  type: 'object',
  properties: {
    fullName: fullNameSchema,
    phone: phoneSchema,
    email: emailSchema,
  },
  required: ['fullName', 'phone', 'email'],
};

// define ID form UI schema
export const idFormUiSchema = {
  fullName: fullNameUI(),
  phone: phoneUI(),
  email: emailUI(),
};
