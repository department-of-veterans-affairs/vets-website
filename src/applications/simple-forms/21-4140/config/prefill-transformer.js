// @ts-check
import { normalizeLegacyEmploymentSelection } from '../utils/employment';

const cloneFormData = source => {
  if (!source || typeof source !== 'object') {
    return {};
  }
  return { ...source };
};

export default function prefillTransformer(pages, formData, metadata) {
  const normalizedFormData = normalizeLegacyEmploymentSelection(
    cloneFormData(formData),
  );

  return {
    pages,
    formData: normalizedFormData,
    metadata,
  };
}
