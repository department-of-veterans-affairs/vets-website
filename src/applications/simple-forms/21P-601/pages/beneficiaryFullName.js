import {
  titleUI,
  fullNameUI,
  fullNameSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI("Deceased beneficiary's name"),
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
