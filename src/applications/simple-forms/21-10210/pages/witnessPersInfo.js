import React from 'react';

import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import formDefinitions from '../definitions/form-definitions';

export default {
  uiSchema: {
    witnessFullName: fullNameUI,
    witnessRelationshipToClaimant: {
      'ui:description': (
        <p className="vads-u-margin-bottom--0 vads-u-margin-top--4">
          What is your relationship to the Claimant?{' '}
          <span className="form-required-span">(* Required)</span>
          <br />
          Check all that apply.
        </p>
      ),
      // checkboxes' '(* Required)' spans hidden via styling
      'served-with': {
        'ui:title': 'Served with Claimant',
        'ui:required': formData =>
          !formData.witnessRelationshipToClaimant['family-or-friend'] &&
          !formData.witnessRelationshipToClaimant['coworker-or-supervisor'] &&
          !formData.witnessOtherRelationshipToClaimant,
        'ui:errorMessages': {
          required:
            'Please select at least one option, or provide an unlisted relationship in textbox below',
        },
      },
      'family-or-friend': {
        'ui:title': 'Family/Friend of Claimant',
        'ui:required': formData =>
          !formData.witnessRelationshipToClaimant['served-with'] &&
          !formData.witnessRelationshipToClaimant['coworker-or-supervisor'] &&
          !formData.witnessOtherRelationshipToClaimant,
        'ui:errorMessages': {
          required:
            'Please select at least one option, or provide an unlisted relationship in textbox below',
        },
      },
      'coworker-or-supervisor': {
        'ui:title': 'Coworker/Supervisor of Claimant',
        'ui:required': formData =>
          !formData.witnessRelationshipToClaimant['served-with'] &&
          !formData.witnessRelationshipToClaimant['family-or-friend'] &&
          !formData.witnessOtherRelationshipToClaimant,
        'ui:errorMessages': {
          required:
            'Please select at least one option, or provide an unlisted relationship in textbox below',
        },
      },
    },
    witnessOtherRelationshipToClaimant: {
      'ui:title':
        'If your relationship with the Claimant is not listed, you can write it here (30 characters maximum)',
      'ui:autocomplete': 'off',
      // '(* Required)' span hidden via styling
      'ui:required': formData =>
        !formData.witnessRelationshipToClaimant['served-with'] &&
        !formData.witnessRelationshipToClaimant['family-or-friend'] &&
        !formData.witnessRelationshipToClaimant['coworker-or-supervisor'],
      'ui:errorMessages': {
        required:
          'Please select at least one option above, or provide an unlisted relationship here',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['witnessFullName'],
    properties: {
      witnessFullName: formDefinitions.pdfFullNameNoSuffix,
      witnessRelationshipToClaimant: {
        type: 'object',
        properties: {
          'served-with': { type: 'boolean' },
          'family-or-friend': { type: 'boolean' },
          'coworker-or-supervisor': { type: 'boolean' },
        },
      },
      witnessOtherRelationshipToClaimant: {
        type: 'string',
        maxLength: 30,
      },
    },
  },
};
