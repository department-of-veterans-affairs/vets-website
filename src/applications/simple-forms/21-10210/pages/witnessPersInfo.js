import { fullNameDeprecatedUI } from '../../shared/definitions/rjsfPatterns';
import {
  RELATIONSHIP_TO_VETERAN_OPTIONS,
  RELATIONSHIP_TO_CLAIMANT_OPTIONS,
} from '../definitions/constants';
import { pdfFullNameNoSuffixSchema } from '../../shared/definitions/pdfFullNameNoSuffix';
import GroupCheckboxWidget from '../../shared/components/GroupCheckboxWidget';

/** @type {PageSchema} */
const commonUiSchema = {
  witnessFullName: fullNameDeprecatedUI,
  witnessRelationshipToClaimant: {
    // different ui:title between uiSchemaA & uiSchemaB
    'ui:description': 'You can select more than one.',
    'ui:widget': GroupCheckboxWidget,
    'ui:errorMessages': {
      required: 'Please select at least one option',
    },
    'ui:options': {
      forceDivWrapper: true,
      showFieldLabel: true,
      // different labels between uiSchemaA & uiSchemaB
    },
  },
};
export default {
  uiSchemaA: {
    // Flow 2: vet claimant
    ...commonUiSchema,
    witnessRelationshipToClaimant: {
      ...commonUiSchema.witnessRelationshipToClaimant,
      'ui:title': 'What is your relationship to the Veteran?',
      'ui:options': {
        ...commonUiSchema.witnessRelationshipToClaimant['ui:options'],
        labels: RELATIONSHIP_TO_VETERAN_OPTIONS,
      },
      'ui:errorMessages': {
        required: 'Please select at least one relationship',
      },
    },
  },
  uiSchemaB: {
    // Flow 4: non-vet claimant
    ...commonUiSchema,
    witnessRelationshipToClaimant: {
      ...commonUiSchema.witnessRelationshipToClaimant,
      'ui:title':
        'What’s your relationship to the person with the existing VA claim (also called the claimant)?',
      'ui:options': {
        ...commonUiSchema.witnessRelationshipToClaimant['ui:options'],
        labels: RELATIONSHIP_TO_CLAIMANT_OPTIONS,
      },
      'ui:errorMessages': {
        required: 'Please select at least one relationship',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['witnessFullName', 'witnessRelationshipToClaimant'],
    properties: {
      witnessFullName: pdfFullNameNoSuffixSchema(),
      witnessRelationshipToClaimant: {
        type: 'string',
      },
    },
  },
};
