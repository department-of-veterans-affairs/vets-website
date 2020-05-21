export default function prefillTransformer(pages, formData, metadata) {
  const veteran = formData.data.attributes.veteran;
  return { pages, formData: veteran, metadata };
}
