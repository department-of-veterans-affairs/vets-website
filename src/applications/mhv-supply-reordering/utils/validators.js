export function validateAtLeastOneSelected(errors, fieldData, formData) {
  if (!formData.supplies || formData.supplies.length === 0) {
    errors.addError('Please select at least one supply item.');
    return;
  }

  const selectedCount = formData.supplies.filter(item => item['view:selected'])
    .length;
  if (selectedCount < 1) {
    errors.addError('Please select at least one supply item.');
  }
}
