export default function prefillTransformer(pages, formData, metadata) {
  const basicInfo = {
    veteranFullName: formData?.personalInformation?.fullName,
    veteranDateOfBirth: formData?.personalInformation?.dateOfBirth,
    veteranSocialSecurityNumber: { ssn: formData?.personalInformation?.ssn },
    veteranAddress: formData?.contactInformation?.address,
    veteranPhoneNumber: formData?.contactInformation?.primaryPhone,
    veteranEmailAddress: formData?.contactInformation?.email,
  };

  const newFormData = JSON.parse(JSON.stringify(formData));

  return {
    pages,
    formData: { ...newFormData, ...basicInfo },
    metadata,
  };
}
