export default function validateInternationalPhoneNumbers(savedData) {
  const { formData, metadata } = savedData;
  // add _isValid, _error, and _touched to claimantPhoneNumber
  if (
    formData?.claimantContact?.claimantPhoneNumber &&
    typeof formData.claimantContact.claimantPhoneNumber === 'object' &&
    formData.claimantContact.claimantPhoneNumber.contact
  ) {
    formData.claimantContact.claimantPhoneNumber._isValid = true;
    formData.claimantContact.claimantPhoneNumber._error = null;
    formData.claimantContact.claimantPhoneNumber._touched = false;
  }

  return {
    formData,
    metadata,
  };
}
