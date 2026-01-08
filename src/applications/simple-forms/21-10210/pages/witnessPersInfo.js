import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  titleUI,
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  RELATIONSHIP_TO_VETERAN_OPTIONS,
  RELATIONSHIP_TO_CLAIMANT_OPTIONS,
} from '../definitions/constants';

/** @type {PageSchema} */
const commonUiSchema = {
  ...titleUI('Name and date of birth'),
  witnessFullName: fullNameNoSuffixUI(),
  witnessRelationshipToClaimant: {
    // Will be overridden in uiSchemaA & uiSchemaB with different titles and labels
  },
};

export default {
  uiSchemaA: {
    // Flow 2: vet claimant
    ...commonUiSchema,
    witnessRelationshipToClaimant: checkboxGroupUI({
      title: 'What is your relationship to the Veteran?',
      description: 'You can select more than one.',
      required: true,
      labels: RELATIONSHIP_TO_VETERAN_OPTIONS,
      errorMessages: {
        required: 'Please select at least one relationship',
      },
    }),
  },
  uiSchemaB: {
    // Flow 4: non-vet claimant
    ...commonUiSchema,
    witnessRelationshipToClaimant: checkboxGroupUI({
      title:
        'What’s your relationship to the person with the existing VA claim (also called the claimant)?',
      description: 'You can select more than one.',
      required: true,
      labels: RELATIONSHIP_TO_CLAIMANT_OPTIONS,
      errorMessages: {
        required: 'Please select at least one relationship',
      },
    }),
  },
  schemaA: {
    type: 'object',
    required: ['witnessFullName', 'witnessRelationshipToClaimant'],
    properties: {
      witnessFullName: fullNameNoSuffixSchema,
      witnessRelationshipToClaimant: checkboxGroupSchema(
        Object.keys(RELATIONSHIP_TO_VETERAN_OPTIONS),
      ),
    },
  },
  schemaB: {
    type: 'object',
    required: ['witnessFullName', 'witnessRelationshipToClaimant'],
    properties: {
      witnessFullName: fullNameNoSuffixSchema,
      witnessRelationshipToClaimant: checkboxGroupSchema(
        Object.keys(RELATIONSHIP_TO_CLAIMANT_OPTIONS),
      ),
    },
  },
};
