export const prefillTransformer = (pages, formData, metadata) => {
  return {
    pages,
    formData: {
      veteran: {
        dateOfBirth: formData.veteranDOB,
        fullName: formData.fullName,
        first: formData.fullName.first,
        middle: formData.fullName.middle,
        last: formData.fullName.last,
      },
      physicalAddress: {
        street: formData.physicalAddress.street,
        street2: formData.physicalAddress.street2,
        city: formData.physicalAddress.city,
        state: formData.physicalAddress.state,
        country: formData.physicalAddress.country,
        postalCode: formData.physicalAddress.postalCode,
      },
      veteranSocialSecurityNumber: formData.ssn,
      phoneNumber: formData.phoneNumber,
      emailAddress: formData.emailAddress,
    },
    metadata,
  };
};
