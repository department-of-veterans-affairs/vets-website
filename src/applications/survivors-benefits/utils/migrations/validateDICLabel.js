export default function validateDICLabel(savedData) {
  const { formData, metadata } = savedData;
  if (formData?.claims?.dic) {
    formData.claims.DIC = formData.claims.dic;
    delete formData.claims.dic;
  }
  return {
    formData,
    metadata,
  };
}
