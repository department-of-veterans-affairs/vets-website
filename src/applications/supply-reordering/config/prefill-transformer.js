import {
  countryNameToValue,
  isMilitaryState,
  isTerritory,
} from '../utils/addresses';

export default function prefillTransformer(pages, formData, metadata) {
  const newFormData = formData;

  if (newFormData.vetEmail) {
    newFormData.emailAddress = newFormData.vetEmail;
  }

  if (newFormData.supplies) {
    newFormData.supplies.forEach((supply, idx) => {
      newFormData.supplies[idx].name = supply.productName;
    });
  }

  if (newFormData.permanentAddress?.country) {
    newFormData.permanentAddress.country =
      countryNameToValue(formData.permanentAddress.country) ?? 'USA';
    if (isTerritory(formData.permanentAddress.country)) {
      newFormData.permanentAddress.country = 'USA';
    }
  }
  if (newFormData.permanentAddress) {
    newFormData.permanentAddress.isMilitary = isMilitaryState(
      formData.permanentAddress?.state,
    );
  }
  if (newFormData.permanentAddress?.street2) {
    newFormData.permanentAddress.street2 =
      newFormData.permanentAddress.street2.trim() !== ','
        ? newFormData.permanentAddress.street2
        : undefined;
  }

  return {
    pages,
    formData: newFormData,
    metadata,
  };
}
