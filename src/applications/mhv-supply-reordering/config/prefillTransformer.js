const prefillTransformer = (pages, formData, metadata) => ({
  pages,
  formData: {
    ...formData,
    emailAddress: formData?.vetEmail || formData?.emailAddress,
    permanentAddress: {
      ...formData.permanentAddress,
      country:
        formData?.permanentAddress?.country === 'UNITED STATES'
          ? 'USA'
          : formData?.permanentAddress?.country,
    },
  },
  metadata,
});

export default prefillTransformer;
