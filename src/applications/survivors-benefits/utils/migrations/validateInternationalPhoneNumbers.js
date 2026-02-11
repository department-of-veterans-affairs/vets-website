export default function validateInternationalPhoneNumbers(savedData) {
  const { formData, metadata } = savedData;
  if (
    formData?.claimantPhone &&
    typeof formData.claimantPhone === 'object' &&
    formData.claimantPhone.contact
  ) {
    formData.claimantPhone._isValid =
      formData.claimantPhone.isValid || formData.claimantPhone.IsValid;
    formData.claimantPhone._error =
      formData.claimantPhone.error ?? formData.claimantPhone.Error ?? null;
    formData.claimantPhone._touched =
      formData.claimantPhone.touched || formData.claimantPhone.Touched;
  }
  return {
    formData,
    metadata,
  };
}
