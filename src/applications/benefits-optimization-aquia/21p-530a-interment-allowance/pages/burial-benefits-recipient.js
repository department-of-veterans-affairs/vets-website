import {
  textUI,
  textSchema,
  phoneUI,
  phoneSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const burialBenefitsRecipientPage = {
  uiSchema: {
    burialInformation: {
      recipientOrganization: {
        ...titleUI('Burial benefits recipient'),
        name: textUI('Full name'),
        phoneNumber: phoneUI('Phone number'),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      burialInformation: {
        type: 'object',
        properties: {
          recipientOrganization: {
            type: 'object',
            required: ['name', 'phoneNumber'],
            properties: {
              name: textSchema,
              phoneNumber: phoneSchema,
            },
          },
        },
      },
    },
  },
};
