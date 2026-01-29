const prefillTransformer = (pages, formData, metadata) => {
  const isFreshPrefill = metadata?.prefill === true;
  const updatedMetadata = isFreshPrefill
    ? { ...metadata, returnUrl: undefined }
    : metadata;

  return {
    pages,
    formData: { ...formData },
    metadata: updatedMetadata,
  };
};

export default prefillTransformer;
