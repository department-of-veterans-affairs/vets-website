export default function prefillTransformer(pages, formData, metadata) {
  return {
    metadata,
    formData: {
      applicantName: formData.applicantName,
      // vaFileNumber and ssn usage/fields will be consistent across forms at a later date
      ssn: formData.ssn,
      vaFileNumber: formData.ssn,
    },
    pages,
  };
}
