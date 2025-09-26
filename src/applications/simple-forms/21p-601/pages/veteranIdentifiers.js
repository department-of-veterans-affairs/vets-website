import {
  ssnUI,
  ssnSchema,
  vaFileNumberUI,
  vaFileNumberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    veteranSsn: ssnUI("Veteran's Social Security number"),
    veteranVaFileNumber: vaFileNumberUI("Veteran's VA file number"),
    'ui:description':
      "Enter the VA file number if it's different from the Social Security number.",
  },
  schema: {
    type: 'object',
    required: ['veteranSsn'],
    properties: {
      veteranSsn: ssnSchema,
      veteranVaFileNumber: vaFileNumberSchema,
    },
  },
};
