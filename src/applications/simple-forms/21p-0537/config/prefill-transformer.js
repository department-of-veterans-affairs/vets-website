export default function prefillTransformer(pages, formData, metadata) {
  return {
    pages,
    formData: {
      // The logged-in user's name for signature
      recipientName: formData.user?.profile?.userFullName || {},
    },
    metadata,
  };
}
