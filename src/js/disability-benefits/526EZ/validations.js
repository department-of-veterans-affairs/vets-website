import get from '../../../platform/utilities/data/get';

export function requireOneSelected(errors, fieldData, formData, schema, errorMessages, options) {
  // TODO: If fieldData isn't an array, then what?
  const foundOne = fieldData.some(data => !!get(options.selectedPropName, data));

  if (!foundOne) {
    errors.addError('Please select at least one condition (or all that apply).');
  }
}

export function requireEvidenceType(errors, pageData) {
  const {
    'view:vaMedicalRecords': vaMedicalRecords,
    'view:privateMedicalRecords': privateMedicalRecords,
    'view:otherEvidence': otherEvidence
  } = pageData;

  // Each of these values is undefined unless the corresponding checkbox is checked
  const evidenceSelected = !!(vaMedicalRecords || privateMedicalRecords || otherEvidence);
  if (!evidenceSelected) {
    errors.addError('Please select at least one type of supporting evidence');
  }
}
