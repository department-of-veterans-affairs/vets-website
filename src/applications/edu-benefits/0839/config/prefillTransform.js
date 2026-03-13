export default function prefillTransformer(pages, formData, metadata) {
  return {
    metadata,
    formData: {
      authorizedOfficial: formData.applicantName,
    },
    pages,
  };
}
