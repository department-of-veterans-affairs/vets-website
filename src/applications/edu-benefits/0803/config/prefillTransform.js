export default function prefillTransformer(pages, formData, metadata) {
  return {
    metadata,
    formData: {
      applicantName: formData.applicantName,
      ssn: formData.ssn,
      vaFileNumber: formData.vaFileNumber,
    },
    pages,
  };
}
