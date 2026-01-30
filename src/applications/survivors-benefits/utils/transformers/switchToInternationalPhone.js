export function switchToInternationalPhone(formData) {
  const parsedFormData = JSON.parse(formData);
  const transformedValue = { ...parsedFormData };
  if (!parsedFormData?.claimantPhone) {
    return JSON.stringify(transformedValue);
  }

  if (parsedFormData?.claimantPhone?.countryCode === 'US') {
    transformedValue.claimantPhone = parsedFormData.claimantPhone.contact;
  }
  if (parsedFormData?.claimantPhone?.countryCode !== 'US') {
    const callingCode = parsedFormData.claimantPhone?.callingCode || '';
    const contact = parsedFormData.claimantPhone?.contact || '';
    delete transformedValue.claimantPhone;
    transformedValue.claimantInternationalPhone = `+${callingCode}-${contact}`;
  }
  return JSON.stringify(transformedValue);
}
