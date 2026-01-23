export default function validateInternationalPhoneNumbers(savedData) {
  const { formData, metadata } = savedData;
  if (
    formData?.claimantContact?.claimantPhoneNumber &&
    typeof formData.claimantContact.claimantPhoneNumber === 'object' &&
    formData.claimantContact.claimantPhoneNumber.contact
  ) {
    const { claimantPhoneNumber } = formData.claimantContact;
    formData.claimantContact.claimantPhoneNumber._isValid =
      claimantPhoneNumber.isValid;
    formData.claimantContact.claimantPhoneNumber._error =
      claimantPhoneNumber.error;
    formData.claimantContact.claimantPhoneNumber._touched =
      claimantPhoneNumber.touched;
  }
  return {
    formData,
    metadata,
  };
}
