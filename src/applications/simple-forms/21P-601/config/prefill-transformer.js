export default function prefillTransformer(pages, _formData, metadata, state) {
  const profile = state?.user?.profile || {};

  // Build the prefilled data following the same pattern as 21P-0537
  const formData = {
    // Claimant information from user profile
    claimantFullName: profile.userFullName || {},
    claimantIdentification: {
      ssn: profile.ssn || '',
      vaFileNumber: profile.vaFileNumber,
    },
    claimantDateOfBirth: profile.dob || '',
    claimantAddress: {
      street: profile.mailingAddress?.addressLine1 || '',
      street2: profile.mailingAddress?.addressLine2 || '',
      city: profile.mailingAddress?.city || '',
      state: profile.mailingAddress?.stateCode || '',
      country: profile.mailingAddress?.countryCodeIso3 || '',
      postalCode: profile.mailingAddress?.zipCode || '',
    },
    claimantPhone: profile.homePhone || profile.mobilePhone || '',
    claimantEmail: profile.email || '',

    // Veteran information - can be prefilled from profile if claimant is veteran
    // Otherwise user will enter manually
    veteranFullName: {},
    veteranIdentification: {
      ssn: '',
    },
  };

  return {
    pages,
    formData,
    metadata,
  };
}
