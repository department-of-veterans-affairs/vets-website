export function combineUnitNameAddress(formData) {
  const parsedFormData = JSON.parse(formData);
  const transformedValue = parsedFormData;
  let unitName = '';
  if (parsedFormData?.unitName) {
    unitName = parsedFormData.unitName;
    transformedValue.unitNameAndAddress = unitName;
  }
  if (parsedFormData?.unitAddress) {
    const { street, city, state, postalCode } = parsedFormData.unitAddress;
    transformedValue.unitNameAndAddress += unitName
      ? `, ${street}, ${city}, ${state} ${postalCode}`
      : `${street}, ${city}, ${state} ${postalCode}`;
  }
  delete transformedValue.unitName;
  delete transformedValue.unitAddress;
  return JSON.stringify(transformedValue);
}
