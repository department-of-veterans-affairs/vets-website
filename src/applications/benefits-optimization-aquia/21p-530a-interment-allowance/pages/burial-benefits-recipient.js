import {
  textUI,
  textSchema,
  phoneUI,
  phoneSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const burialBenefitsRecipientPage = {
  uiSchema: {
    ...titleUI('VA interment allowance benefits recipient'),
    'ui:description':
      'This is the organization who will be receiving compensation.',
    burialInformation: {
      recipientOrganization: {
        name: textUI('Name of State Cemetery or Tribal Organization'),
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
