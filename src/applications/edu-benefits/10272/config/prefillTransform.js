export default function prefillTransformer(pages, formData, metadata) {
  // Remove suffix to match the *fullNameNoSuffix* schema definition
  const { first, middle, last } = formData.applicantName;

  return {
    metadata,
    formData: {
      applicantName: { first, middle, last },
      // vaFileNumber and ssn usage/fields will be consistent across forms at a later date
      ssn: formData.ssn,
      vaFileNumber: formData.ssn,
    },
    pages,
  };
}
