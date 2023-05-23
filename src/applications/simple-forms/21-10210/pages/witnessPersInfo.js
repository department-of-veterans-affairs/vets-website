import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import formDefinitions from '../definitions/form-definitions';
import GroupCheckboxWidget from '../components/GroupCheckboxWidget';

/** @type {PageSchema} */
export default {
  uiSchema: {
    witnessFullName: fullNameUI,
    witnessRelationshipToClaimant: {
      'ui:title': 'What is your relationship to the Claimant?',
      'ui:description': 'Check all that apply',
      'ui:widget': GroupCheckboxWidget,
      'ui:required': formData => !formData.witnessOtherRelationshipToClaimant,
      'ui:validations': [
        (errors, value) => {
          if ((value || '').trim() === '') {
            errors.addError(
              'Please select at least one option here, or input a relationship in text-box below',
            );
          }
        },
      ],
      'ui:options': {
        showFieldLabel: true,
        forceDivWrapper: true,
        labels: [
          'Served with Claimant',
          'Family/Friend of Claimant',
          'Coworker/Supervisor of Claimant',
        ],
      },
    },
    witnessOtherRelationshipToClaimant: {
      'ui:title':
        'If your relationship with the Claimant is not listed, you can write it here (30 characters maximum)',
      'ui:autocomplete': 'off',
      // '(* Required)' span hidden via styling
      'ui:required': formData => !formData.witnessRelationshipToClaimant,
      'ui:errorMessages': {
        required:
          'Please input a relationship in text-box here, or select at least 1 option above',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['witnessFullName'],
    properties: {
      witnessFullName: formDefinitions.pdfFullNameNoSuffix,
      witnessRelationshipToClaimant: {
        // type: 'object',
        // properties: {
        //   'served-with': { type: 'boolean' },
        //   'family-or-friend': { type: 'boolean' },
        //   'coworker-or-supervisor': { type: 'boolean' },
        // },
        type: 'string',
      },
      witnessOtherRelationshipToClaimant: {
        type: 'string',
        maxLength: 30,
      },
    },
  },
};
