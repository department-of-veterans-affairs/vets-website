const prefillTransformer = (pages, formData, metadata) => {
  return {
    pages,
    formData: {
      ...formData,
      veteranFullName: formData.veteranFullName,
      veteranAddress: formData.veteranAddress,
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
