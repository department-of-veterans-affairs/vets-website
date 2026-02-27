import { buildAddress } from './helpers';

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
