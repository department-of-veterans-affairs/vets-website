import _ from 'lodash/fp';

export function prefillTransformer(pages, formData, metadata, state) {
  const { verified } = state.user.profile;

  const newFormData = _.set('verified', !!verified, formData);

  return {
    metadata,
    formData: newFormData,
    pages
  };
}
