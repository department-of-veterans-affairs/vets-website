import { validateBooleanGroup } from 'platform/forms-system/src/js/validation';
import { validateIfHasEvidence } from '../validations';
import get from 'platform/utilities/data/get';

import {
  evidenceTypeTitle,
  evidenceTypeHelp,
} from '../content/evidenceTypesBDD';

export const uiSchema = {
  'view:hasEvidence': {
    'ui:title':
      'Is there any other evidence you’d like us to review as part of your claim?',
    'ui:widget': 'yesNo',
  },
  'view:hasEvidenceFollowUp': {
    'ui:options': {
      expandUnder: 'view:hasEvidence',
    },
    'ui:required': formData => get('view:hasEvidence', formData, false),
    'view:selectableEvidenceTypes': {
      'ui:title': evidenceTypeTitle,
      'ui:validations': [
        {
          validator: validateIfHasEvidence,
          options: { wrappedValidator: validateBooleanGroup },
        },
      ],
      'ui:errorMessages': {
        atLeastOne: 'Please select at least one type of supporting evidence',
      },
      'ui:required': formData => get('view:hasEvidence', formData, false),
      'view:hasPrivateMedicalRecords': {
        'ui:title': 'Private medical records',
      },
      'view:hasOtherEvidence': {
        'ui:title': 'Supporting (lay) statements or other evidence',
      },
    },
    'view:evidenceTypeHelp': {
      'ui:title': ' ',
      'ui:description': evidenceTypeHelp,
      'ui:options': {
        forceDivWrapper: true,
      },
    },
  },
};

export const schema = {
  type: 'object',
  required: ['view:hasEvidence'],
  properties: {
    'view:hasEvidence': {
      type: 'boolean',
      default: true,
    },
    'view:hasEvidenceFollowUp': {
      type: 'object',
      properties: {
        'view:selectableEvidenceTypes': {
          type: 'object',
          properties: {
            'view:hasPrivateMedicalRecords': { type: 'boolean' },
            'view:hasOtherEvidence': { type: 'boolean' },
          },
        },
        'view:evidenceTypeHelp': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
