export default function prefillTransformer(formData) {
  const newFormData = {
    ...formData,
  };

  // transform as needed
  newFormData.exampleTransformedKey = true;

  return newFormData;
}
