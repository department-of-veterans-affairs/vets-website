const prefillTransformer = (pages, formData, metadata) => ({
  pages,
  formData: {
    ...formData,
    emailAddress: formData?.vetEmail || formData?.emailAddress,
  },
  metadata,
});

export default prefillTransformer;
