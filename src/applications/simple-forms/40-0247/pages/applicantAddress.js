import {
  titleUI,
  addressNoMilitarySchema,
  addressNoMilitaryUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Tell us where we should send the certificate',
      'If you want us to send copies to another address, you can add an additional address later in this form.',
    ),
    applicantAddress: addressNoMilitaryUI({
      labels: {
        street2: 'Apartment or unit number',
      },
      omit: ['isMilitary', 'street3'],
      required: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      applicantAddress: addressNoMilitarySchema({
        omit: ['isMilitary', 'street3'],
      }),
    },
    required: ['applicantAddress'],
  },
};
