const buildAddress = unitAddress => {
  const { street, street2, city, state, postalCode } = unitAddress;
  let address = street || '';
  if (street2) {
    address += `, ${street2}`;
  }
  if (city) {
    address += `, ${city}`;
  }
  if (state) {
    address += `, ${state}`;
  }
  if (postalCode) {
    address += ` ${postalCode}`;
  }
  return address;
};

export function combineUnitNameAddress(formData) {
  const parsedFormData = JSON.parse(formData);
  const transformedValue = parsedFormData;
  let unitName = '';
  if (parsedFormData?.unitName) {
    unitName = parsedFormData.unitName;
    transformedValue.unitNameAndAddress = unitName;
  }
  if (parsedFormData?.unitAddress) {
    transformedValue.unitNameAndAddress += unitName
      ? `, ${buildAddress(parsedFormData.unitAddress)}`
      : `${buildAddress(parsedFormData.unitAddress)}`;
  }
  delete transformedValue.unitName;
  delete transformedValue.unitAddress;
  return JSON.stringify(transformedValue);
}
