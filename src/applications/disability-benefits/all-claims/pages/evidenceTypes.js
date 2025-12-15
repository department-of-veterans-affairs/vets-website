import VaCheckboxGroupField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxGroupField';
import { validateBooleanGroup } from 'platform/forms-system/src/js/validation';
import get from 'platform/utilities/data/get';
import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { validateIfHasEvidence } from '../validations';
import { standardTitle } from '../content/form0781';

import { evidenceTypeHelp } from '../content/evidenceTypes';

export const uiSchema = {
  'ui:title': standardTitle('Types of supporting evidence'),
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
      'ui:title': 'Non-VA treatment records',
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
