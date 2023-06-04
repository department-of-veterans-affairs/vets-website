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
    'ui:required': formData => !formData.witnessOtherRelationshipToClaimant,
    'ui:options': {
      forceDivWrapper: true,
      showFieldLabel: true,
      // different labels between uiSchemaA & uiSchemaB
    },
  },
  witnessOtherRelationshipToClaimant: {
    // different ui:title between uiSchemaA & uiSchemaB
    'ui:autocomplete': 'off',
  },
  'ui:validations': [
    (errors, fields) => {
      if (
        (fields.witnessRelationshipToClaimant || '').trim() === '' &&
        (fields.witnessOtherRelationshipToClaimant || '').trim() === ''
      ) {
        errors.witnessRelationshipToClaimant.addError(
          'Please select at least one option here, or input a relationship in text-box below',
        );
      }
    },
  ],
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
    witnessOtherRelationshipToClaimant: {
      ...commonUiSchema.witnessOtherRelationshipToClaimant,
      'ui:title':
        'If your relationship with the Veteran is not listed, you can write it here (30 characters maximum)',
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
    witnessOtherRelationshipToClaimant: {
      ...commonUiSchema.witnessOtherRelationshipToClaimant,
      'ui:title':
        'If your relationship with the Claimant is not listed, you can write it here (30 characters maximum)',
    },
  },
  schema: {
    type: 'object',
    required: ['witnessFullName'],
    properties: {
      witnessFullName: formDefinitions.pdfFullNameNoSuffix,
      witnessRelationshipToClaimant: {
        type: 'string',
      },
      witnessOtherRelationshipToClaimant: {
        type: 'string',
        maxLength: 30,
      },
    },
  },
};
