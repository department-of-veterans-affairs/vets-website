import React from 'react';

import definitions from 'vets-json-schema/dist/definitions.json';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';

export default {
  uiSchema: {
    witnessFullName: fullNameUI,
    witnessRelationshipToClaimant: {
      'ui:description': (
        <p className="vads-u-margin-bottom--0 vads-u-margin-top--4">
          What is your relationship to the Claimant?
          <br />
          Check all that apply.
        </p>
      ),
      'ui:help': 'Check all the apply',
      'family-or-friend': {
        'ui:title': 'Family/Friend of Claimant',
        'ui:required': form =>
          !form.withnessOtherRelationshipToClaimant &&
          !form.witnessRelationshipToClaimant['coworker-or-supervisor'],
        'ui:errorMessages': {
          required:
            'Please select at least one option, or input other relationship below',
        },
      },
      'coworker-or-supervisor': {
        'ui:title': 'Coworker/Supervisor of Claimant',
        'ui:required': form =>
          !form.withnessOtherRelationshipToClaimant &&
          !form.witnessRelationshipToClaimant['family-or-friend'],
        'ui:errorMessages': {
          required:
            'Please select at least one option, or input other relationship below',
        },
      },
    },
    withnessOtherRelationshipToClaimant: {
      'ui:title':
        'If your relationship with the Claimant is not listed, you can write it here (255 characters maximum)',
      'ui:required': form =>
        !form.witnessRelationshipToClaimant['family-or-friend'] &&
        !form.witnessRelationshipToClaimant['coworker-or-supervisor'],
      'ui:errorMessages': {
        required:
          'Please input relationship, or check at least one option above',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['witnessFullName'],
    properties: {
      witnessFullName: definitions.fullNameNoSuffix,
      witnessRelationshipToClaimant: {
        type: 'object',
        properties: {
          'family-or-friend': { type: 'boolean' },
          'coworker-or-supervisor': { type: 'boolean' },
        },
      },
      withnessOtherRelationshipToClaimant: {
        type: 'string',
        maxLength: 255,
      },
    },
  },
};
