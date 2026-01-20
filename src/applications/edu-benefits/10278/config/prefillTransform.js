export default function prefillTransformer(pages, formData, metadata) {
  return {
    metadata,
    formData,
    pages,
  };
}
