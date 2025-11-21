import {
  ssnSchema,
  ssnUI,
  titleUI,
  vaFileNumberSchema,
  vaFileNumberUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Veteran identification'),
    veteranSsn: ssnUI(),
    veteranVaFileNumber: vaFileNumberUI(),
  },
  schema: {
    type: 'object',
    properties: {
      veteranSsn: ssnSchema,
      veteranVaFileNumber: vaFileNumberSchema,
    },
    required: [],
  },
};
