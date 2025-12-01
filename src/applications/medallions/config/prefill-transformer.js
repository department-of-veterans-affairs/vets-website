/* eslint-disable no-console */
export default function prefillTransformer(pages, formData, metadata, state) {
  const { user } = state || {};
  const { profile } = user || {};
  const { vapContactInfo } = profile || {};
  const { mailingAddress } = vapContactInfo || {};
  // Build the transformed form data at root level
  const transformedFormData = {
    // Preserve any existing form data
    ...formData,
    // Add login state tracking to formData for use in depends fields
    'view:loginState': {
      isLoggedIn: state?.user?.login?.currentlyLoggedIn || false,
    },
    // Prefill mailing address from VA Profile if available
    ...(mailingAddress && {
      applicantMailingAddress: {
        street: mailingAddress.addressLine1 || '',
        street2: mailingAddress.addressLine2 || '',
        city: mailingAddress.city || '',
        state: mailingAddress.stateCode || '',
        postalCode: mailingAddress.zipCode || '',
        country: mailingAddress.countryCodeIso3 || 'USA',
      },
    }),
  };

  return {
    pages,
    formData: transformedFormData,
    metadata,
  };
}
