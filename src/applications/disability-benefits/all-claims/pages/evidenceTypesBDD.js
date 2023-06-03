import { validateBooleanGroup } from '@department-of-veterans-affairs/platform-forms-system/validation';
import _ from 'platform/utilities/data';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import { validateIfHasEvidence } from '../validations';

import {
  evidenceTypeTitle,
  privateMedicalRecords,
  evidenceTypeError,
  evidenceTypeHelp,
  HasEvidenceLabel,
  bddShaOtherEvidence,
} from '../content/evidenceTypesBDD';

import { BddEvidenceSubmitLater } from '../content/bddEvidenceSubmitLater';

export const uiSchema = {
  'view:hasEvidence': {
    'ui:title': ' ',
    'ui:description': HasEvidenceLabel,
    'ui:widget': 'yesNo',
    'ui:options': {
      labels: {
        Y: 'Yes',
        N: 'No, I will submit more information later',
      },
      widgetProps: {
        N: {
          'aria-describedby': 'submit-evidence-later',
        },
      },
    },
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
        'ui:title': bddShaOtherEvidence,
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
  'view:evidenceSubmitLater': {
    'ui:title': '',
    'ui:description': BddEvidenceSubmitLater,
    'ui:options': {
      hideIf: data => _.get('view:hasEvidence', data, true),
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
    'view:evidenceSubmitLater': {
      type: 'object',
      properties: {},
    },
  },
};
