import { buildAddress } from './helpers';

export function buildUnitAddress(formData) {
  const parsedFormData = JSON.parse(formData);
  const transformedValue = parsedFormData;

  if (parsedFormData?.unitAddress) {
    transformedValue.unitNameAndAddress = buildAddress(
      parsedFormData.unitAddress,
    );
  }

  delete transformedValue.unitName;
  delete transformedValue.unitAddress;

  return JSON.stringify(transformedValue);
}
