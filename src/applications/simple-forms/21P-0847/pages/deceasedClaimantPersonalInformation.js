import {
  currentOrPastDateSchema,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaMemorableDateField from 'platform/forms-system/src/js/web-component-fields/VaMemorableDateField';
import { validateCurrentOrPastMemorableDate } from 'platform/forms-system/src/js/validation';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'view:deceasedClaimantPersonalInfoTitle': titleUI(
      'Deceased Claimant',
      'Now, we’ll ask for information about the person whose claim you’re requesting to continue.',
    ),
    deceasedClaimantFullName: fullNameNoSuffixUI(),
    deceasedClaimantDateOfDeath: {
      'ui:title': 'Date of death',
      'ui:webComponentField': VaMemorableDateField,
      'ui:validations': [validateCurrentOrPastMemorableDate],
      'ui:errorMessages': {
        required: 'Please add date of death',
      },
    },
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
