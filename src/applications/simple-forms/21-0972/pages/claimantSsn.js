import {
  ssnSchema,
  ssnUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    claimantSsn: ssnUI(),
  },
  schema: {
    type: 'object',
    properties: {
      claimantSsn: ssnSchema,
    },
    required: ['claimantSsn'],
  },
};
