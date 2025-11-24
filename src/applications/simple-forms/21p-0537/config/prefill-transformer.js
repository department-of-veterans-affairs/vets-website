export default function prefillTransformer(pages, formData, metadata, state) {
  const { profile = {} } = state?.user || {};
  const { userFullName } = profile;
  // TODO: get fullname from formdata if not logged in?

  return {
    pages,
    formData: {
      ...formData,
      'view:recipientName': userFullName || { first: '', last: '' },
      primaryPhone: formData.claimantPhone || '',
      emailAddress: formData.claimantEmail || '',
    },
    metadata,
  };
}
