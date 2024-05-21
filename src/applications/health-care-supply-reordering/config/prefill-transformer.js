import { nameToValue } from '../utils/country-mapping';

export default function prefillTransformer(pages, formData, metadata) {
  const newFormData = formData;
  if (newFormData.permanentAddress?.country) {
    newFormData.permanentAddress.country = nameToValue(
      formData.permanentAddress.country,
    );
  }
  if (newFormData.temporaryAddress?.country) {
    newFormData.temporaryAddress.country =
      nameToValue(formData.temporaryAddress.country) ?? 'USA';
  }
  if (newFormData.temporaryAddress) {
    newFormData.temporaryAddress.city = formData.temporaryAddress.city ?? '';
    newFormData.temporaryAddress.state = formData.temporaryAddress.state ?? '';
    newFormData.temporaryAddress.street =
      formData.temporaryAddress.street ?? '';
  }
  return {
    pages,
    formData: newFormData,
    metadata,
  };
}
