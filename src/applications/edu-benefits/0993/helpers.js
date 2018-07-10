import _ from 'lodash/fp';

export function prefillTransformer(pages, formData, metadata) {
  const newFormData = _.set('verified', !!metadata.verified, formData);

  return {
    metadata,
    formData: newFormData,
    pages
  };
}
