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
          'view:applicantInfo': {
            mailingAddress: formData.application.claimant.address,
          },
        },
        claimant: {
          name: formData.application.claimant.name,
          address: formData.application.claimant.address,
          ssn: formData.application.claimant.ssn,
          dateOfBirth: formData.application.claimant.dateOfBirth,
        },
      },
    },
    metadata,
  };
}
