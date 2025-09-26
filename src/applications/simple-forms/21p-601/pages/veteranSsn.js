import {
  ssnUI,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    veteranSsn: ssnUI("Veteran's Social Security number"),
  },
  schema: {
    type: 'object',
    required: ['veteranSsn'],
    properties: {
      veteranSsn: ssnSchema,
    },
  },
};
