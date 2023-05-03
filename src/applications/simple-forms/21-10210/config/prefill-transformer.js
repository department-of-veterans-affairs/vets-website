export default function prefillTransformer(pages, formData, metadata) {
  return {
    pages,
    formData: {
      veteran: {
        fullName: formData?.veteranFullName,
        dateOfBirth: formData?.veteranDateOfBirth,
        ssn: formData?.veteranSSN,
        mailingAddress: formData?.veteranMailingAddress,
        mobilePhone: formData?.veteranPhone,
        email: formData?.veteranEmail,
      },
    },
    metadata,
  };
}
