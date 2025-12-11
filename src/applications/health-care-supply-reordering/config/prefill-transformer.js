import {
  countryNameToValue,
  isMilitaryState,
  isTerritory,
} from '../utils/addresses';

export default function prefillTransformer(pages, formData, metadata) {
  const newFormData = formData;

  // prefill temporaryAddress if empty
  const { street } = formData?.temporaryAddress || {};
  if (!street || street.trim().length === 0) {
    newFormData.temporaryAddress = { ...formData.permanentAddress };
  }

  for (const addressType of ['permanentAddress', 'temporaryAddress']) {
    if (newFormData[addressType]?.country) {
      newFormData[addressType].country =
        countryNameToValue(formData[addressType].country) ?? 'USA';
      if (isTerritory(formData[addressType].country)) {
        newFormData[addressType].country = 'USA';
      }
    }
    if (newFormData[addressType]) {
      newFormData[addressType].isMilitary = isMilitaryState(
        formData[addressType]?.state,
      );
    }
    if (newFormData[addressType]?.street2) {
      newFormData[addressType].street2 =
        newFormData[addressType].street2.trim() !== ','
          ? newFormData[addressType].street2
          : undefined;
    }
  }

  return {
    pages,
    formData: newFormData,
    metadata,
  };
}
