import {
  ssnSchema,
  ssnUI,
  titleSchema,
  titleUI,
  vaFileNumberSchema,
  vaFileNumberUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'view:title': titleUI('Identification information'),
    veteranSsn: ssnUI(),
    veteranVaFileNumber: vaFileNumberUI(),
  },
  schema: {
    type: 'object',
    properties: {
      'view:title': titleSchema,
      veteranSsn: ssnSchema,
      veteranVaFileNumber: vaFileNumberSchema,
    },
    required: ['veteranSsn'],
  },
};
