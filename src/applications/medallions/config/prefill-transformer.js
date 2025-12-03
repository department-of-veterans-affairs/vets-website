export default function prefillTransformer(
  pages,
  formData,
  metadata,
  formContext,
) {
  return {
    pages,
    formData: {
      // Add login state tracking to formData for use in depends fields
      'view:loginState': {
        isLoggedIn: formContext?.user?.login?.currentlyLoggedIn || false,
      },
      // application: {
      //   applicant: {
      //     name: {
      //       first: formData.application.claimant.name.first,
      //       last: formData.application.claimant.name.last,
      //     },
      //     'view:applicantInfo': {
      //       mailingAddress: formData.application.claimant.address,
      //     },
      //   },
      //   claimant: {
      //     name: formData.application.claimant.name,
      //     address: formData.application.claimant.address,
      //     ssn: formData.application.claimant.ssn,
      //     dateOfBirth: formData.application.claimant.dateOfBirth,
      //     email: formData.application.claimant.email,
      //     phoneNumber: formData.application.claimant.phoneNumber,
      //   },
      // },
      email: formData.email,
      phoneNumber: formData.phoneNumber,
    },
    metadata,
  };
}
