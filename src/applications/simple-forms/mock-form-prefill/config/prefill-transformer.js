export const prefillTransformer = (pages, formData, metadata) => {
  const {
    ssn,
    vaFileNumber,
    firstName,
    middleName,
    lastName,
    suffix,
    dateOfBirth,
    gender,
    address = {},
    homePhone,
    mobilePhone,
    emailAddressText,
    lastServiceBranch,
  } = formData?.data?.attributes?.veteran || {};

  return {
    metadata,
    formData: {
      ssn,
      vaFileNumber,
      fullName: {
        first: firstName,
        middle: middleName,
        last: lastName,
        suffix,
      },
      dateOfBirth,
      gender,
      veteran: {
        mailingAddress: {
          street: address.addressLine1,
          street2: address.addressLine2,
          street3: address.addressLine3,
          city: address.city,
          state: address.stateCode,
          postalCode: address.zipCode5,
          country: address.countryName,
        },
        homePhone,
        mobilePhone,
        email: emailAddressText
          ? { emailAddress: emailAddressText }
          : undefined,
      },
      lastServiceBranch,
    },
    pages,
  };
};
