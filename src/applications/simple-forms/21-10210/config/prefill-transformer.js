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
      veteranFullName: fullName,
      veteranDateOfBirth: dateOfBirth,
      veteranSSN: ssn,
      veteranMailingAddress: address,
      veteranPhone: homePhone,
      veteranEmail: email,
    },
    metadata,
  };
}
