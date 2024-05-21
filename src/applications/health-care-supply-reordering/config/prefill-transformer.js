import { nameToValue } from '../utils/country-mapping';

export default function prefillTransformer(pages, formData, metadata) {
  const newFormData = formData;
  newFormData.permanentAddress.country = nameToValue(
    formData.permanentAddress.country,
  );
  newFormData.temporaryAddress.country =
    nameToValue(formData.temporaryAddress.country) ?? 'USA';
  newFormData.temporaryAddress.city = formData.temporaryAddress.city ?? '';
  newFormData.temporaryAddress.state = formData.temporaryAddress.state ?? '';
  newFormData.temporaryAddress.street = formData.temporaryAddress.street ?? '';
  return {
    pages,
    formData: newFormData,
    metadata,
  };
}
