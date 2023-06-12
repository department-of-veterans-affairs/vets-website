import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import {
  RELATIONSHIP_TO_VETERAN_OPTIONS,
  RELATIONSHIP_TO_CLAIMANT_OPTIONS,
} from '../definitions/constants';
import formDefinitions from '../definitions/form-definitions';
import GroupCheckboxWidget from '../components/GroupCheckboxWidget';

/** @type {PageSchema} */
const commonUiSchema = {
  witnessFullName: fullNameUI,
  witnessRelationshipToClaimant: {
    // different ui:title between uiSchemaA & uiSchemaB
    'ui:description': 'Check all that apply',
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
    },
  },
  uiSchemaB: {
    // Flow 4: non-vet claimant
    ...commonUiSchema,
    witnessRelationshipToClaimant: {
      ...commonUiSchema.witnessRelationshipToClaimant,
      'ui:title': 'What is your relationship to the Claimant?',
      'ui:options': {
        ...commonUiSchema.witnessRelationshipToClaimant['ui:options'],
        labels: RELATIONSHIP_TO_CLAIMANT_OPTIONS,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['witnessFullName', 'witnessRelationshipToClaimant'],
    properties: {
      witnessFullName: formDefinitions.pdfFullNameNoSuffix,
      witnessRelationshipToClaimant: {
        type: 'string',
      },
    },
  },
};
