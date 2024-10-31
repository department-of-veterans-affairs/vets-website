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
            mailingAddress: {
              street: formData.application.claimant.address.street,
              city: formData.application.claimant.address.city,
              state: formData.application.claimant.address.state,
              postalCode: formData.application.claimant.address.postalCode,
            },
          },
        },
        claimant: {
          name: {
            first: formData.application.claimant.name.first,
            last: formData.application.claimant.name.last,
          },
          address: {
            street: formData.application.claimant.address.street,
            city: formData.application.claimant.address.city,
            state: formData.application.claimant.address.state,
            postalCode: formData.application.claimant.address.postalCode,
          },
          ssn: formData.application.claimant.ssn,
          dateOfBirth: formData.application.claimant.dateOfBirth,
        },
      },
    },
    metadata,
  };
}
