import {
  fullNameSchema,
  fullNameUI,
  addressSchema,
  addressUI,
  phoneUI,
  phoneSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Your personal information',
      'Name of person completing this form',
    ),
    witness: {
      fullName: fullNameUI(),
      address: addressUI({ title: 'Address of person completing this form' }),
      phone: {
        daytime: phoneUI('Daytime telephone number'),
        evening: phoneUI('Evening telephone number'),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      witness: {
        type: 'object',
        properties: {
          fullName: fullNameSchema,
          address: addressSchema(),
          phone: {
            type: 'object',
            properties: {
              daytime: phoneSchema,
              evening: phoneSchema,
            },
          },
        },
        required: ['fullName', 'address'],
      },
    },
    required: ['witness'],
  },
};
