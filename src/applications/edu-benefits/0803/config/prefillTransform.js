export default function prefillTransformer(pages, formData, metadata) {
  return {
    metadata,
    formData: {
      ssn: formData.ssn,
      vaFileNumber: formData.vaFileNumber,
    },
    pages,
  };
}
