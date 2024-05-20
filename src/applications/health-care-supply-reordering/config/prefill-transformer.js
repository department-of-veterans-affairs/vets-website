import { nameToValue } from '../utils/country-mapping';

export default function prefillTransformer(pages, formData, metadata) {
  const newFormData = formData;
  newFormData.permanentAddress.country = nameToValue(
    formData.permanentAddress.country,
  );
  newFormData.temporaryAddress.country = nameToValue(
    formData.temporaryAddress.country,
  );
  return {
    pages,
    formData: newFormData,
    metadata,
  };
}
