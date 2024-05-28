import { countryNameToValue, isMilitaryState } from '../utils/addresses';

export default function prefillTransformer(pages, formData, metadata) {
  const newFormData = formData;

  for (const addressType of ['permanentAddress', 'temporaryAddress']) {
    if (newFormData[addressType]?.country) {
      newFormData[addressType].country =
        countryNameToValue(formData[addressType].country) ?? 'USA';
    }
    if (newFormData[addressType]?.state) {
      newFormData[addressType].isMilitary = isMilitaryState(
        formData[addressType].state,
      );
    }
  }

  return {
    pages,
    formData: newFormData,
    metadata,
  };
}
