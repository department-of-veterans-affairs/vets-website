import React from 'react';

import definitions from 'vets-json-schema/dist/definitions.json';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';

export default {
  uiSchema: {
    witnessFullName: fullNameUI,
    witnessRelationshipToVeteran: {
      'ui:description': (
        <p className="vads-u-margin-bottom--0 vads-u-margin-top--4">
          What is your relationship to the Veteran?
          <br />
          Check all that apply.
        </p>
      ),
      'ui:help': 'Check all the apply',
      'served-with': {
        'ui:title': 'Served with Veteran',
      },
      'family-or-friend': {
        'ui:title': 'Family/Friend of Veteran',
      },
      'coworker-or-supervisor': {
        'ui:title': 'Coworker/Supervisor of Veteran',
      },
    },
    witnessOtherRelationshipToVeteran: {
      'ui:title':
        'If your relationship with the Veteran is not listed, you can write it here (255 characters maximum)',
    },
  },
  schema: {
    type: 'object',
    required: ['witnessFullName'],
    properties: {
      witnessFullName: definitions.fullNameNoSuffix,
      witnessRelationshipToVeteran: {
        type: 'object',
        properties: {
          'served-with': { type: 'boolean' },
          'family-or-friend': { type: 'boolean' },
          'coworker-or-supervisor': { type: 'boolean' },
        },
      },
      witnessOtherRelationshipToVeteran: {
        type: 'string',
        maxLength: 255,
      },
    },
  },
};
