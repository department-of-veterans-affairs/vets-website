import { validateBooleanGroup } from 'us-forms-system/lib/js/validation';
import { validateIfHasEvidence } from '../validations';
import get from '../../../../platform/utilities/data/get';

import {
  evidenceTypeHelp,
  noEvidenceDescription,
} from '../content/evidenceTypes';

export const uiSchema = {
  'view:hasEvidence': {
    'ui:title':
      'Do you have any evidence that you’d like to submit with your claim?',
    'ui:widget': 'yesNo',
  },
  'view:hasEvidenceFollowUp': {
    'ui:options': {
      expandUnder: 'view:hasEvidence',
    },
    'ui:required': formData => get('view:hasEvidence', formData, false),
    'view:selectableEvidenceTypes': {
      'ui:title':
        'What type of evidence do you want to submit with your claim?',
      'ui:options': { showFieldLabel: true },
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
      'view:hasVAMedicalRecords': { 'ui:title': 'VA medical records' },
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
    },
  },
  'view:noEvidenceFollowUp': {
    'ui:title': ' ',
    'ui:description': noEvidenceDescription,
    'ui:options': {
      expandUnder: 'view:hasEvidence',
      expandUnderCondition: false,
    },
  },
};

export const schema = {
  type: 'object',
  required: ['view:hasEvidence'],
  properties: {
    'view:hasEvidence': {
      type: 'boolean',
    },
    'view:hasEvidenceFollowUp': {
      type: 'object',
      properties: {
        'view:selectableEvidenceTypes': {
          type: 'object',
          properties: {
            'view:hasVAMedicalRecords': { type: 'boolean' },
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
    'view:noEvidenceFollowUp': {
      type: 'object',
      properties: {},
    },
  },
};
