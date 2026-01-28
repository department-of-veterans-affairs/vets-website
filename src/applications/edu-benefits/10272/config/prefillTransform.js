export default function prefillTransformer(pages, formData, metadata) {
  return {
    metadata,
    formData: {
      applicantName: formData.applicantName,
      // vaFileNumber and ssn usage/fields will be consistent across forms at a later date
      vaFileNumber: formData.ssn,
    },
    pages,
  };
}
