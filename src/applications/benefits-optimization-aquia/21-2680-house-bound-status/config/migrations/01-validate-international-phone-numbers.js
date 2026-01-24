export default function validateInternationalPhoneNumbers(savedData) {
  const { formData, metadata } = savedData;
  if (
    formData?.claimantContact?.claimantPhoneNumber &&
    typeof formData.claimantContact.claimantPhoneNumber === 'object' &&
    formData.claimantContact.claimantPhoneNumber.contact
  ) {
    const { claimantPhoneNumber } = formData.claimantContact;
    formData.claimantContact.claimantPhoneNumber._isValid =
      claimantPhoneNumber.isValid || claimantPhoneNumber.IsValid;
    formData.claimantContact.claimantPhoneNumber._error =
      claimantPhoneNumber.error ?? claimantPhoneNumber.Error ?? null;
    formData.claimantContact.claimantPhoneNumber._touched =
      claimantPhoneNumber.touched || claimantPhoneNumber.Touched;
  }
  return {
    formData,
    metadata,
  };
}
