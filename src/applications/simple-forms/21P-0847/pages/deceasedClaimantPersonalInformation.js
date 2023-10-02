import {
  dateOfDeathUI,
  dateOfDeathSchema,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Deceased Claimant',
      'Now, we’ll ask for information about the person whose claim you’re requesting to continue.',
    ),
    deceasedClaimantFullName: fullNameNoSuffixUI(),
    deceasedClaimantDateOfDeath: dateOfDeathUI(),
  },
  schema: {
    type: 'object',
    properties: {
      deceasedClaimantFullName: fullNameNoSuffixSchema,
      deceasedClaimantDateOfDeath: dateOfDeathSchema,
    },
    required: ['deceasedClaimantDateOfDeath'],
  },
};
