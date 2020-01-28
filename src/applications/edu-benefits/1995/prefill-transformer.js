import omit from 'lodash/omit';

export function prefillTransformer(pages, formData, metadata) {
  const { homePhone, email } = formData;

  const newFormData = {
    ...omit(formData, ['homePhone', 'email']),
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
