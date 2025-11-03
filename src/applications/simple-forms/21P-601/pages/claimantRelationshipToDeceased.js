import {
  titleUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const relationshipOptions = {
  executor: "I'm the executor of the beneficiary's estate",
  creditor: "I'm a creditor",
};

export default {
  uiSchema: {
    ...titleUI('Your relationship to the beneficiary'),
    relationshipToDeceased: radioUI({
      title: "What's your relationship to the beneficiary?",
      labels: relationshipOptions,
    }),
  },
  schema: {
    type: 'object',
    required: ['relationshipToDeceased'],
    properties: {
      relationshipToDeceased: radioSchema(Object.keys(relationshipOptions)),
    },
  },
  relationshipOptions,
};
