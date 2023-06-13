import {
  ssnSchema,
  ssnUI,
  vaFileNumberSchema,
  vaFileNumberUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    deceasedClaimantSsn: ssnUI(),
    deceasedClaimantVaFileNumber: vaFileNumberUI(),
  },
  schema: {
    type: 'object',
    properties: {
      deceasedClaimantSsn: ssnSchema,
      deceasedClaimantVaFileNumber: vaFileNumberSchema,
    },
    required: ['deceasedClaimantSsn'],
  },
};
