export default function prefillTransformer(pages, formData, metadata) {
  const veteran = formData.data.attributes.veteran;

  const data = {
    phoneEmailCard: {
      // phone number needed TWICE for phone & email widget to work...
      // shown as primary phone in non-edit mode
      primaryPhone: veteran.phoneNumber,
      emailAddress: veteran.emailAddress,
    },

    mailingAddress: {
      address1: veteran.address1,
      address2: veteran.address2,
      city: veteran.city,
      state: veteran.stateOrProvinceCode,
      postalCode: veteran.zipPostalCode,
      country: veteran.countryCode || 'USA',
    },
  };

  return { pages, formData: data, metadata };
}
