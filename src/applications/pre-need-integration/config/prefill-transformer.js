export default function prefillTransformer(pages, formData, metadata) {
  return {
    pages,
    formData: {
      application: {
        applicant: {
          name: {
            first: formData.application.claimant.name.first,
            last: formData.application.claimant.name.last,
          },
          //   street: formData.application.claimant.mailingAddress.street,
        },
        claimant: {
          name: {
            first: formData.application.claimant.name.first,
            last: formData.application.claimant.name.last,
          },
        },
      },
    },
    metadata,
  };
}
