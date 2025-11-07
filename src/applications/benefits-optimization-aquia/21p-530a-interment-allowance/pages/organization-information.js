import {
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    organizationInformation: textUI('Organization name'),
  },
  schema: {
    type: 'object',
    required: ['organizationInformation'],
    properties: {
      organizationInformation: textSchema,
    },
  },
};
