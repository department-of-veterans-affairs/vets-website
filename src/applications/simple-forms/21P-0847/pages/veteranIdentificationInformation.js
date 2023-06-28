import {
  ssnSchema,
  ssnUI,
  vaFileNumberSchema,
  vaFileNumberUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    veteranSsn: ssnUI(),
    veteranVaFileNumber: vaFileNumberUI(),
  },
  schema: {
    type: 'object',
    properties: {
      veteranSsn: ssnSchema,
      veteranVaFileNumber: vaFileNumberSchema,
    },
    required: ['veteranSsn'],
  },
};
