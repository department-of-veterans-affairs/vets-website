import {
  addressSchema,
  addressUI,
  titleUI,
  phoneUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Spouse’s address and phone number',
  path: 'spouse-contact-information',
  uiSchema: {
    ...titleUI("Spouse's address and phone number"),
    spouseAddress: addressUI({
      labels: {
        militaryCheckbox:
          'My spouse lives on a U.S. military base outside of the United States.',
      },
    }),
    spousePhone: phoneUI('Phone number'),
  },
  schema: {
    type: 'object',
    properties: {
      spouseAddress: addressSchema(),
      spousePhone: {
        type: 'string',
        pattern: '^[\\d\\-+\\s()]*$',
      },
    },
  },
};
