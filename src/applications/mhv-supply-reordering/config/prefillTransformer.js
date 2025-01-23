import {
  countryNameToValue,
  isMilitaryState,
  isTerritory,
} from '../utils/addresses';

const prefillTransformer = (pages, formData, metadata) => {
  const newFormData = formData;

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
    formData: {
      ...newFormData,
      emailAddress: formData?.vetEmail || formData?.emailAddress,
    },
    metadata,
  };
};

export default prefillTransformer;
