import {
  arrayBuilderItemFirstPageTitleUI,
  addressNoMilitaryUI,
  addressNoMilitarySchema,
  textUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Organization name and mailing address',
    }),
    organizationName: textUI({
      title: 'Name of organization',
      errorMessages: {
        required: 'Enter name of organization',
      },
    }),
    organizationAddress: addressNoMilitaryUI({
      labels: {
        street2: 'Apartment/Unit number',
      },
      omit: ['street3'],
      required: {
        street2: false,
      },
    }),
  },

  schema: {
    type: 'object',
    required: ['organizationName', 'organizationAddress'],
    properties: {
      organizationName: textSchema,
      organizationAddress: addressNoMilitarySchema({
        omit: ['street3'],
      }),
    },
  },
};
