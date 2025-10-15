export const prefillTransformer = (pages, formData, metadata, _state) => {
  // Merge claimId and metadata into form data
  return {
    pages,
    formData,
    metadata,
  };
};
