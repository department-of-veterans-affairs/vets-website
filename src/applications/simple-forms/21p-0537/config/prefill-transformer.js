export default function prefillTransformer(pages, formData, metadata, state) {
  const { profile = {} } = state?.user || {};
  const { userFullName } = profile;

  return {
    pages,
    formData: {
      ...formData,
      recipientName: userFullName || { first: '', last: '' },
      primaryPhone: formData.claimantPhone || '',
      emailAddress: formData.claimantEmail || '',
    },
    metadata,
  };
}
