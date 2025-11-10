// @ts-check
import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Name and address of organization issuing the license or certification',
    ),
    organizationName: {
      ...textUI({
        title: 'Name of organization',
        required: () => true,
        errorMessages: {
          required: 'Enter the name of the organization',
        },
      }),
    },
    organizationAddress: {
      ...addressNoMilitaryUI(),
    },
  },
  schema: {
    type: 'object',
    properties: {
      organizationName: textSchema,
      organizationAddress: addressNoMilitarySchema(),
    },
    required: ['organizationName'],
  },
};
