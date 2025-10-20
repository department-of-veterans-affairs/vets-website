export default function prefillTransformer(pages, _formData, metadata, state) {
  const { profile = {} } = state?.user || {};
  const { userFullName, email, phoneNumber } = profile;

  return {
    pages,
    formData: {
      recipientName: userFullName || { first: '', last: '' },
      primaryPhone: phoneNumber || '',
      emailAddress: email || '',
    },
    metadata,
    state,
  };
}
