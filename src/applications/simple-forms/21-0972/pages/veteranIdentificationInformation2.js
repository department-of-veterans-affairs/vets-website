import {
  serviceNumberUI,
  ssnSchema,
  ssnUI,
  vaFileNumberUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    veteranSsn: ssnUI(),
    veteranVaFileNumber: vaFileNumberUI(),
    veteranServiceNumber: serviceNumberUI(
      'Veteran’s service number (if applicable)',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      veteranSsn: ssnSchema,
      veteranVaFileNumber: {
        type: 'string',
        pattern: '^\\d{8,9}$',
      },
      veteranServiceNumber: {
        type: 'string',
        pattern: '^[a-zA-Z]{0,2}\\d{5,8}$',
      },
    },
    required: ['veteranSsn'],
  },
};
