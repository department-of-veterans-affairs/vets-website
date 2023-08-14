import {
  currentOrPastDateSchema,
  dateOfDeathUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'view:deceasedClaimantPersonalInfoTitle': titleUI(
      'Deceased Claimant',
      'Now, we’ll ask for information about the person whose claim you’re requesting to continue.',
    ),
    deceasedClaimantFullName: fullNameNoSuffixUI(),
    deceasedClaimantDateOfDeath: dateOfDeathUI(),
  },
  schema: {
    type: 'object',
    properties: {
      'view:deceasedClaimantPersonalInfoTitle': titleSchema,
      deceasedClaimantFullName: fullNameNoSuffixSchema,
      deceasedClaimantDateOfDeath: currentOrPastDateSchema,
    },
    required: ['deceasedClaimantDateOfDeath'],
  },
};
