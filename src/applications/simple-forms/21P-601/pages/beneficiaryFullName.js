import {
  fullNameUI,
  fullNameSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    beneficiaryFullName: fullNameUI(),
  },
  schema: {
    type: 'object',
    required: ['beneficiaryFullName'],
    properties: {
      beneficiaryFullName: fullNameSchema,
    },
  },
};
