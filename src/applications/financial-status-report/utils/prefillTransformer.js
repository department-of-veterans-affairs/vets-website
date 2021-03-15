export function prefillTransformer(pages, formData, metadata, state) {
  const { mailingAddress } = state.user.profile?.vapContactInfo;
  const { emailAddress } = state.user.profile?.vapContactInfo?.email;
  const {
    areaCode,
    phoneNumber,
  } = state.user.profile?.vapContactInfo?.mobilePhone;

  let newData = formData;

  if (mailingAddress) {
    newData = {
      ...newData,
      personalData: {
        ...newData.personalData,
        address: mailingAddress,
      },
    };
  }

  if (areaCode && phoneNumber) {
    newData = {
      ...newData,
      personalData: {
        ...newData.personalData,
        telephoneNumber: areaCode + phoneNumber,
      },
    };
  }

  if (emailAddress) {
    newData = {
      ...newData,
      personalData: {
        ...newData.personalData,
        primaryEmail: emailAddress,
      },
    };
  }

  return {
    metadata,
    formData: newData,
    pages,
  };
}
