const prefillTransformer = (pages, formData, metadata, state) => {
  const { veteran = {} } = formData;
  const {
    fullName,
    dateOfBirth,
    ssn,
    vaFileNumber,
    address = {},
    phoneNumber,
    email,
  } = veteran;
  const { profile } = state.user;
  const {
    ssn: profileSsn,
    userFullName: profileFullName,
    dob: profileDateOfBirth,
    vaFileNumber: profileVaFileNumber,
    homePhone: profileHomePhone,
    mobilePhone: profileMobilePhone,
    email: profileEmail,
    mailingAddress: profileAddress = {},
  } = profile;

  return {
    pages,
    formData: {
      fullName: fullName
        ? {
            first: fullName.first,
            middle: fullName.middle,
            last: fullName.last,
            suffix: fullName.suffix,
          }
        : {
            first: profileFullName?.first,
            middle: profileFullName?.middle,
            last: profileFullName?.last,
            suffix: profileFullName?.suffix,
          },
      dateOfBirth: dateOfBirth || profileDateOfBirth,
      veteranId: {
        ssn: ssn || profileSsn,
        vaFileNumber: vaFileNumber || profileVaFileNumber,
      },
      address: {
        street: address.street || profileAddress.addressLine1,
        street2: address.street2 || profileAddress.addressLine2,
        street3: address.street3 || profileAddress.addressLine3,
        city: address.city || profileAddress.city,
        state: address.state || profileAddress.stateCode,
        postalCode: address.postalCode || profileAddress.zipCode,
        country: address.country || profileAddress.countryCodeIso3,
      },
      homePhone: phoneNumber || profileHomePhone,
      mobilePhone: profileMobilePhone,
      emailAddress: email || profileEmail,
    },
    metadata,
    state,
  };
};

export default prefillTransformer;
