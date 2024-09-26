import { validateBooleanGroup } from '@department-of-veterans-affairs/platform-forms-system/validation';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import _ from 'platform/utilities/data';
import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import { validateIfHasEvidence } from '../validations';

import {
  evidenceTypeTitle,
  privateMedicalRecords,
  evidenceTypeError,
  evidenceTypeHelp,
  bddShaOtherEvidence,
} from '../content/evidenceTypesBDD';

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
    'ui:options': {
      expandUnder: 'view:hasEvidence',
    },
    'ui:required': formData => get('view:hasEvidence', formData, false),
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
    'view:hasPrivateMedicalRecords': {
      'ui:webComponentField': VaCheckboxField,
      'ui:title': privateMedicalRecords,
    },
    'view:hasOtherEvidence': {
      'ui:webComponentField': VaCheckboxField,
      'ui:title': bddShaOtherEvidence,
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
    'view:hasEvidence': yesNoSchema,
    'view:selectableEvidenceTypes': {
      type: 'object',
      properties: {
        'view:hasPrivateMedicalRecords': { type: 'boolean' },
        'view:hasOtherEvidence': { type: 'boolean' },
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
