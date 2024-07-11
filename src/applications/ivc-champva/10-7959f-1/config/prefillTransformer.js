const prefillTransformer = (pages, formData, metadata) => {
  return {
    pages,
    formData: {
      ...formData,
      veteranFullName: formData.veteranFullName,
      veteranAddress: formData.veteranAddress,
      physicalAddress: {
        city: formData?.veteranPhysicalAddress?.city,
        country: formData?.veteranPhysicalAddress?.countryName,
        postalCode: formData?.veteranPhysicalAddress?.zipCode,
        state: formData?.veteranPhysicalAddress?.stateCode,
        street: formData?.veteranPhysicalAddress?.addressLine1,
        street2: formData?.veteranPhysicalAddress?.addressLine2,
        street3: formData?.veteranPhysicalAddress?.addressLine3,
      },
      veteranDateOfBirth: formData.veteranDateOfBirth,
      veteranSocialSecurityNumber: {
        ssn: formData.veteranSocialSecurityNumber,
        vaFileNumber: null,
      },
      veteranPhoneNumber: formData.veteranPhoneNumber,
      veteranEmailAddress: formData.veteranEmailAddress,
    },
    metadata,
  };
};

export default prefillTransformer;
