import _ from 'lodash';

export function prefillTransformer(pages, formData, metadata, state) {
  const { homePhone, email } = formData;
  const { edipi, icn } = state.user.profile;

  const newFormData = {
    ..._.omit(formData, ['homePhone', 'email', 'edipi', 'icn']),
    'view:otherContactInfo': {
      homePhone,
      email,
    },
    edipi,
    icn,
  };

  return {
    metadata,
    formData: newFormData,
    pages,
  };
}
