import { evidenceTypeHelp } from '../content/evidenceTypes';

export const uiSchema = {
  hasEvidence: {
    'ui:title': 'Do you have any evidence that you’d like to submit with your claim?',
    'ui:widget': 'yesNo'
  },
  'view:hasEvidenceFollowUp': {
    'ui:options': {
      expandUnder: 'hasEvidence'
    },
    'view:selectableEvidenceTypes': {
      'ui:title': ' ',
      'ui:description': 'What type of evidence do you want to submit with your claim?',
      'view:hasVAMedicalRecords': { 'ui:title': 'VA medical records' },
      'view:hasPrivateMedicalRecords': { 'ui:title': 'Private medical records' },
      'view:hasOtherEvidence': { 'ui:title': 'Supporting (lay) statements or other evidence' }
    },
    'view:evidenceTypeHelp': {
      'ui:description': evidenceTypeHelp
    }
  }
};

export const schema = {
  type: 'object',
  properties: {
    hasEvidence: {
      type: 'boolean'
    },
    'view:hasEvidenceFollowUp': {
      type: 'object',
      properties: {
        'view:selectableEvidenceTypes': {
          type: 'object',
          properties: {
            'view:hasVAMedicalRecords': { type: 'boolean' },
            'view:hasPrivateMedicalRecords': { type: 'boolean' },
            'view:hasOtherEvidence': { type: 'boolean' }
          }
        },
        'view:evidenceTypeHelp': {
          type: 'object',
          properties: {}
        }
      }
    }
  }
};
