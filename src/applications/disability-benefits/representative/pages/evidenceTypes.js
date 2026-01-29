/**
 * Evidence Types Page for Representative Form
 *
 * Simplified version that asks what types of evidence the veteran has.
 * This is a local version to avoid dependencies on all-claims specific imports.
 */

export const uiSchema = {
  'ui:title': 'Supporting evidence',
  'ui:description':
    'Select the types of evidence that support the veteran\u2019s claim.',
  'view:hasEvidence': {
    'ui:title': 'Does the veteran have any evidence to support this claim?',
    'ui:widget': 'yesNo',
  },
  'view:hasVaMedicalRecords': {
    'ui:title':
      'Are there VA medical records related to the claimed conditions?',
    'ui:widget': 'yesNo',
    'ui:options': {
      expandUnder: 'view:hasEvidence',
    },
  },
  'view:hasPrivateMedicalRecords': {
    'ui:title':
      'Are there private medical records related to the claimed conditions?',
    'ui:widget': 'yesNo',
    'ui:options': {
      expandUnder: 'view:hasEvidence',
    },
  },
  'view:hasOtherEvidence': {
    'ui:title':
      'Is there other evidence (lay statements, buddy statements, etc.)?',
    'ui:widget': 'yesNo',
    'ui:options': {
      expandUnder: 'view:hasEvidence',
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:hasEvidence': {
      type: 'boolean',
    },
    'view:hasVaMedicalRecords': {
      type: 'boolean',
    },
    'view:hasPrivateMedicalRecords': {
      type: 'boolean',
    },
    'view:hasOtherEvidence': {
      type: 'boolean',
    },
  },
};

export default {
  uiSchema,
  schema,
};
