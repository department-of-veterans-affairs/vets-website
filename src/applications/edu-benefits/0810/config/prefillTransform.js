export default function prefillTransformer(pages, formData, metadata) {
  // Remove suffix to match the *fullNameNoSuffix* schema definition
  const { first, middle, last } = formData.applicantName;

  return {
    metadata,
    formData: {
      applicantName: { first, middle, last },
      // vaFileNumber and ssn usage/fields will be based on the *Chapter 35* VA benefit
      ssn: formData.ssn,
      vaFileNumber: formData.vaFileNumber,
    },
    pages,
  };
}
