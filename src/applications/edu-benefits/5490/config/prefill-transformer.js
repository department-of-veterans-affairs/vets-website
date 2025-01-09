import _ from 'lodash';

export function prefillTransformer(pages, formData, metadata, state) {
  const { edipi, icn } = state.user.profile;

  const newFormData = {
    ..._.omit(formData, ['edipi', 'icn']),
    edipi,
    icn,
  };

  return {
    metadata,
    formData: newFormData,
    pages,
  };
}
