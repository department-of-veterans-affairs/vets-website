export default function prefillTransformer(pages, _formData, metadata, state) {
  const profile = state?.user?.profile || {};

  // Mock name for unauthenticated users (phone and email are collected in form)
  const mockName = {
    first: 'Jane',
    last: 'Doe',
  };

  return {
    pages,
    formData: {
      recipientName: profile.userFullName || mockName,
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
