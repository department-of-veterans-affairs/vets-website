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

export const emailMissing = (formData = {}) => {
  // console.log({ isEmailMissing });
  return !formData?.emailAddress;
};

export const permanentAddressMissing = (formData = {}) => {
  // console.log({ isPermanentAddressMissing });
  return (
    !formData?.permanentAddress?.street ||
    !formData?.permanentAddress?.city ||
    !formData?.permanentAddress?.state ||
    !formData?.permanentAddress?.postalCode ||
    !formData?.permanentAddress?.country
  );
};
