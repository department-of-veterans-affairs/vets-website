import {
  vaFileNumberUI,
  vaFileNumberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    veteranVaFileNumber: vaFileNumberUI("Veteran's VA file number"),
    'ui:description':
      "Enter the VA file number if it's different from the Social Security number.",
  },
  schema: {
    type: 'object',
    properties: {
      veteranVaFileNumber: vaFileNumberSchema,
    },
  },
};
