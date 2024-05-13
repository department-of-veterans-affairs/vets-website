const prefillTransformer = (pages, formData, metadata) => {
  return {
    pages,
    formData: {
      ...formData,
      veteranFullName: formData.veteranFullName,
      veteranAddress: formData.veteranAddress,
      veteranHomßeAddress: formData.physicalAddress,
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
