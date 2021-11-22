import { validateBooleanGroup } from 'platform/forms-system/src/js/validation';
import { validateIfHasEvidence } from '../validations';
import get from 'platform/utilities/data/get';

import {
  hasEvidenceLabel,
  evidenceTypeTitle,
  privateMedicalRecords,
  evidenceLayStatements,
  evidenceTypeError,
  evidenceTypeHelp,
} from '../content/evidenceTypesBDD';

export const uiSchema = {
  'view:hasEvidence': {
    'ui:title': hasEvidenceLabel,
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
        atLeastOne: evidenceTypeError,
      },
      'ui:required': formData => get('view:hasEvidence', formData, false),
      'view:hasPrivateMedicalRecords': {
        'ui:title': privateMedicalRecords,
      },
      'view:hasOtherEvidence': {
        'ui:title': evidenceLayStatements,
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
