import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import { RELATIONSHIP_TO_CLAIMANT_OPTIONS } from '../definitions/constants';
import formDefinitions from '../definitions/form-definitions';
import GroupCheckboxWidget from '../components/GroupCheckboxWidget';

/** @type {PageSchema} */
export default {
  uiSchema: {
    witnessFullName: fullNameUI,
    witnessRelationshipToClaimant: {
      'ui:title': 'What is your relationship to the Veteran/Claimant?',
      'ui:description': 'Check all that apply',
      'ui:widget': GroupCheckboxWidget,
      'ui:required': formData => !formData.witnessOtherRelationshipToClaimant,
      'ui:options': {
        forceDivWrapper: true,
        showFieldLabel: true,
        labels: RELATIONSHIP_TO_CLAIMANT_OPTIONS,
      },
    },
    witnessOtherRelationshipToClaimant: {
      'ui:title':
        'If your relationship with the Veteran/Claimant is not listed, you can write it here (30 characters maximum)',
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
