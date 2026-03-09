import { buildAddress } from './helpers';

export function buildUnitAddress(formData) {
  const parsedFormData = JSON.parse(formData);
  const transformedValue = parsedFormData;

  if (parsedFormData?.unitAddress) {
    transformedValue.unitAddress = buildAddress(parsedFormData.unitAddress);
  }

  return JSON.stringify(transformedValue);
}
