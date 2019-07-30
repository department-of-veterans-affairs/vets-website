import _ from 'lodash';

export function prefillTransformer(pages, formData, metadata) {
  const { homePhone, email } = formData;

  const newFormData = {
    ..._.omit(formData, ['homePhone', 'email']),
    'view:otherContactInfo': {
      homePhone,
      email,
    },
  };

  return {
    metadata,
    formData: newFormData,
    pages,
  };
}
