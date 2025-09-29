export default function prefillTransformer(pages, _formData, metadata, state) {
  const profile = state?.user?.profile || {};

  return {
    pages,
    formData: {
      recipientName: profile.userFullName || {},
      recipient: {
        email: profile.email || '',
        phone: {
          daytime: profile.phoneNumber || '',
        },
      },
    },
    metadata,
  };
}
