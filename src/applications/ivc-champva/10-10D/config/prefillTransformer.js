const prefillTransformer = (pages, formData, metadata) => {
  return {
    pages,
    formData: { ...formData },
    metadata,
  };
};

export default prefillTransformer;
