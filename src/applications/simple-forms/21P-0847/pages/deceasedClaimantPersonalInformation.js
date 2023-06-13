import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    deceasedClaimantName: fullNameNoSuffixUI(),
    deceasedClaimantDateOfBirth: dateOfBirthUI(),
    deceasedClaimantDateOfDeath: currentOrPastDateUI('Date of death'),
  },
  schema: {
    type: 'object',
    properties: {
      deceasedClaimantName: fullNameNoSuffixSchema,
      deceasedClaimantDateOfBirth: dateOfBirthSchema,
      deceasedClaimantDateOfDeath: currentOrPastDateSchema,
    },
    required: ['deceasedClaimantDateOfBirth'],
  },
};
