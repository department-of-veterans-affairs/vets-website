export default function prefillTransformer(pages, formData, metadata) {
  const {
    fullName,
    ssn,
    dateOfBirth,
    homePhone,
    email,
    address,
  } = formData?.veteran;
  return {
    pages,
    formData: {
      veteran: {
        fullName,
        dateOfBirth,
        ssn,
        mailingAddress: address,
        mobilePhone: homePhone,
        email,
      },
    },
    metadata,
  };
}
