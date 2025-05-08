import VaCheckboxGroupField from '@department-of-veterans-affairs/platform-forms-system/web-component-fields/VaCheckboxGroupField';
import { validateBooleanGroup } from '@department-of-veterans-affairs/platform-forms-system/validation';
import get from '@department-of-veterans-affairs/platform-utilities/data/get';
import {
  yesNoUI,
  yesNoSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { validateIfHasEvidence } from '../validations';

import { evidenceTypeHelp } from '../content/evidenceTypes';

export const uiSchema = {
  'view:hasEvidence': yesNoUI({
    title:
      'Is there any evidence you’d like us to review as part of your claim?',
  }),
  'view:selectableEvidenceTypes': {
    'ui:title':
      'What type of evidence do you want us to review as part of your claim?',
    'ui:webComponentField': VaCheckboxGroupField,
    'ui:options': {
      showFieldLabel: true,
      expandUnder: 'view:hasEvidence',
    },
    'ui:required': formData => get('view:hasEvidence', formData, false),
    'ui:validations': [
      {
        validator: validateIfHasEvidence,
        options: { wrappedValidator: validateBooleanGroup },
      },
    ],
    'ui:errorMessages': {
      atLeastOne: 'Please select at least one type of supporting evidence',
    },
    'view:hasVaMedicalRecords': { 'ui:title': 'VA medical records' },
    'view:hasPrivateMedicalRecords': {
      'ui:title': 'Private medical records',
    },
    'view:hasOtherEvidence': {
      'ui:title': 'Supporting (lay) statements or other evidence',
    },
  },
  'view:evidenceTypeHelp': {
    'ui:options': {
      expandUnder: 'view:hasEvidence',
    },
    'ui:title': ' ',
    'ui:description': evidenceTypeHelp,
  },
};

export const schema = {
  type: 'object',
  required: ['view:hasEvidence'],
  properties: {
    'view:hasEvidence': yesNoSchema,
    'view:selectableEvidenceTypes': {
      type: 'object',
      properties: {
        'view:hasVaMedicalRecords': { type: 'boolean' },
        'view:hasPrivateMedicalRecords': { type: 'boolean' },
        'view:hasOtherEvidence': { type: 'boolean' },
      },
    },
    'view:evidenceTypeHelp': {
      type: 'object',
      properties: {},
    },
  },
};
