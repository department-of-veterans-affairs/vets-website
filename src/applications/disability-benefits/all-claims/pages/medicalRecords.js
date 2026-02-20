import get from 'platform/utilities/data/get';
import VaCheckboxGroupField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxGroupField';
import { validateMedicalRecordsAtLeastOne } from '../validations';
import { standardTitle } from '../content/form0781';
import { medicalRecordQuestion } from '../content/evidenceRequest';

/**
 * Preserve hasOtherEvidence value when this page updates.
 * This ensures compatibility when transitioning between legacy and enhancement flows.
 */
export const updateFormData = (oldFormData, formData) => {
  // Preserve the hasOtherEvidence value from either:
  // 1. The old formData (if it existed before)
  // 2. Or keep it undefined if it never existed
  const hasOtherEvidence = get(
    'view:selectableEvidenceTypes.view:hasOtherEvidence',
    oldFormData,
  );

  return {
    ...formData,
    'view:selectableEvidenceTypes': {
      ...(formData['view:selectableEvidenceTypes'] || {}),
      'view:hasOtherEvidence': hasOtherEvidence,
    },
  };
};

export const uiSchema = {
  'ui:title': standardTitle('Types of medical records'),
  'view:selectableEvidenceTypes': {
    'ui:title': { medicalRecordQuestion },
    'ui:webComponentField': VaCheckboxGroupField,
    'ui:options': {
      showFieldLabel: true,
    },
    'ui:required': () => true,
    'ui:validations': [
      {
        validator: validateMedicalRecordsAtLeastOne,
        options: {},
      },
    ],
    'ui:errorMessages': {
      atLeastOne: 'Select at least one type of medical record',
    },
    'view:hasVaMedicalRecords': { 'ui:title': 'VA medical records' },
    'view:hasPrivateMedicalRecords': {
      'ui:title': 'Private medical records',
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:selectableEvidenceTypes': {
      type: 'object',
      properties: {
        'view:hasVaMedicalRecords': { type: 'boolean' },
        'view:hasPrivateMedicalRecords': { type: 'boolean' },
      },
    },
  },
};
