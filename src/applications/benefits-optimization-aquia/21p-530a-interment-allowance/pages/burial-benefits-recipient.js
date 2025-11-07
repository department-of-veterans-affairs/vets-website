import {
  textUI,
  textSchema,
  phoneUI,
  phoneSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    fullName: textUI('Full name'),
    phoneNumber: phoneUI('Phone number'),
  },
  schema: {
    type: 'object',
    required: ['fullName', 'phoneNumber'],
    properties: {
      fullName: textSchema,
      phoneNumber: phoneSchema,
    },
  },
};
