import { EvidenceTypeHelp, titles } from '../content/evidenceTypes';
import { validateEvidenceType } from '../validations/evidence';

export default {
  uiSchema: {
    'view:selectableEvidenceTypes': {
      'ui:title': titles.types,
      'ui:options': {
        showFieldLabel: true,
      },
      'ui:validations': [validateEvidenceType],
      'ui:required': () => true,
      'view:hasVaEvidence': { 'ui:title': titles.vaMr },
      'view:hasPrivateEvidence': { 'ui:title': titles.privateMr },
      'view:hasOtherEvidence': { 'ui:title': titles.other },
    },
    'view:evidenceTypeHelp': {
      'ui:title': ' ',
      'ui:description': EvidenceTypeHelp,
    },
  },

  schema: {
    type: 'object',
    properties: {
      'view:selectableEvidenceTypes': {
        type: 'object',
        properties: {
          'view:hasVaEvidence': { type: 'boolean' },
          'view:hasPrivateEvidence': { type: 'boolean' },
          'view:hasOtherEvidence': { type: 'boolean' },
        },
      },
      'view:evidenceTypeHelp': {
        type: 'object',
        properties: {},
      },
    },
  },
};
