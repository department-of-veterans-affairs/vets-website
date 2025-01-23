import VaCheckboxGroupField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxGroupField';
import { validateBooleanGroup } from '@department-of-veterans-affairs/platform-forms-system/validation';
import _ from 'platform/utilities/data';
import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import { validateIfHasEvidence } from '../validations';

import { evidenceTypeHelp } from '../content/evidenceTypesBDD';

import { BddEvidenceSubmitLater } from '../content/bddEvidenceSubmitLater';

export const uiSchema = {
  'view:hasEvidence': yesNoUI({
    title:
      'Do you want to upload any other documents or evidence at this time?',
    labels: {
      Y: 'Yes',
      N: 'No, I will submit more information later',
    },
  }),
  'view:selectableEvidenceTypes': {
    // Displaying atLeastOne validation errors requires using a VaCheckboxGroupField,
    // which for some reason won't render if export title text from evidenceTypesBDD.jsx.
    // Thus, titles are written out here.
    'ui:title':
      'What type of evidence do you want to submit as part of your claim',
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
    'view:hasPrivateMedicalRecords': {
      'ui:title': 'Private medical records',
    },
    'view:hasOtherEvidence': {
      'ui:title':
        'Required Separation Health Assessment - Part A Self-Assessment or other documents like your DD Form 214, supporting (lay) statements, or other evidence',
    },
  },
  'view:evidenceTypeHelp': {
    'ui:title': ' ',
    'ui:description': evidenceTypeHelp,
    'ui:options': {
      expandUnder: 'view:hasEvidence',
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
    'view:hasEvidence': yesNoSchema,
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
    'view:evidenceSubmitLater': {
      type: 'object',
      properties: {},
    },
  },
};
