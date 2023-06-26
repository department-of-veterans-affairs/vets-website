import {
  ssnSchema,
  ssnUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    preparerSsn: ssnUI(),
  },
  schema: {
    type: 'object',
    properties: {
      preparerSsn: ssnSchema,
    },
    required: ['preparerSsn'],
  },
};
