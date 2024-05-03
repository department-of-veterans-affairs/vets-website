const prefillTransformer = (pages, metadata, formData) => {
  return {
    pages,
    formData: {
      ...formData,
      veteranFullName: formData.fullName,
      veteranAddress: formData.mailingAddress,
      veteranDateOfBirth: formData.veteranDOB,
      veteranSocialSecurityNumber: formData.ssn,
      veteranPhoneNumber: formData.phoneNumber,
      veteranEmailAddress: formData.emailAddress,
    },
    metadata,
  };
};

export default prefillTransformer;
