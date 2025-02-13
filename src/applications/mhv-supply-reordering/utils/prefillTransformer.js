import { countryNameToValue, isMilitaryState, isTerritory } from './addresses';

const prefillTransformer = (pages, formData, metadata) => {
  const newFormData = formData;

  // prefill permanentAddress if empty
  if (Object.keys(formData?.permanentAddress || {}).length === 0) {
    newFormData.permanentAddress = { ...formData.temporaryAddress };
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
    formData: {
      ...newFormData,
      emailAddress: formData?.vetEmail || formData?.emailAddress,
    },
    metadata,
  };
};

export default prefillTransformer;
