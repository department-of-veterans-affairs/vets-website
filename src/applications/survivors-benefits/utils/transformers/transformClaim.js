export function transformClaim(formData) {
  const parsedFormData = JSON.parse(formData);
  const transformedValue = parsedFormData;
  if (parsedFormData?.claims?.dic) {
    // Leaving both, so we can adjust vets-api without breaking.
    // JS objects are case-sensitive.
    transformedValue.claims.DIC = parsedFormData.claims.dic;
  }
  return JSON.stringify(transformedValue);
}
