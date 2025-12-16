export default function prefillTransformer(pages, formData, metadata) {
  // The only things we need from the preill currenrly are the
  // ssn (should always be available) and the va file number
  // (only available sometimes)
  return {
    metadata,
    formData: {
      ssn: formData.ssn,
      vaFileNumber: formData.vaFileNumber,
    },
    pages,
  };
}
