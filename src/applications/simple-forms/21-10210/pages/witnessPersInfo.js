import React from 'react';

import { cloneDeep } from 'lodash';

import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import formDefinitions from '../definitions/form-definitions';

const fullNameUiSchema = cloneDeep(fullNameUI);
// PDF only has 1 box for Middle name, so we need to override the title
fullNameUiSchema.middle['ui:title'] = 'Middle initial';

export default {
  uiSchema: {
    witnessFullName: fullNameUiSchema,
    witnessRelationshipToVeteran: {
      'ui:description': (
        <p className="vads-u-margin-bottom--0 vads-u-margin-top--4">
          What is your relationship to the Veteran?{' '}
          <span className="form-required-span">(* Required)</span>
          <br />
          Check all that apply.
        </p>
      ),
      // checkboxes' '(* Required)' spans hidden via styling
      'served-with': {
        'ui:title': 'Served with Veteran',
        'ui:required': formData =>
          !formData.witnessRelationshipToVeteran['family-or-friend'] &&
          !formData.witnessRelationshipToVeteran['coworker-or-supervisor'] &&
          !formData.witnessOtherRelationshipToVeteran,
        'ui:errorMessages': {
          required:
            'Please select at least one option, or provide an unlisted relationship in textbox below',
        },
      },
      'family-or-friend': {
        'ui:title': 'Family/Friend of Veteran',
        'ui:required': formData =>
          !formData.witnessRelationshipToVeteran['served-with'] &&
          !formData.witnessRelationshipToVeteran['coworker-or-supervisor'] &&
          !formData.witnessOtherRelationshipToVeteran,
        'ui:errorMessages': {
          required:
            'Please select at least one option, or provide an unlisted relationship in textbox below',
        },
      },
      'coworker-or-supervisor': {
        'ui:title': 'Coworker/Supervisor of Veteran',
        'ui:required': formData =>
          !formData.witnessRelationshipToVeteran['served-with'] &&
          !formData.witnessRelationshipToVeteran['family-or-friend'] &&
          !formData.witnessOtherRelationshipToVeteran,
        'ui:errorMessages': {
          required:
            'Please select at least one option, or provide an unlisted relationship in textbox below',
        },
      },
    },
    witnessOtherRelationshipToVeteran: {
      'ui:title':
        'If your relationship with the Veteran is not listed, you can write it here (255 characters maximum)',
      // '(* Required)' span hidden via styling
      'ui:required': formData =>
        !formData.witnessRelationshipToVeteran['served-with'] &&
        !formData.witnessRelationshipToVeteran['family-or-friend'] &&
        !formData.witnessRelationshipToVeteran['coworker-or-supervisor'],
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
