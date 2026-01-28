import get from 'platform/utilities/data/get';
import VaCheckboxGroupField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxGroupField';
import { validateBooleanGroup } from 'platform/forms-system/src/js/validation';
import { validateIfHasEvidence } from '../validations';
import { standardTitle } from '../content/form0781';

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
    'ui:title':
      'What type of medical records would you like us to access on your behalf?',
    'ui:webComponentField': VaCheckboxGroupField,
    'ui:options': {
      showFieldLabel: true,
    },
    'ui:required': () => true,
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
