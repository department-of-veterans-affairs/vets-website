module.exports = {
  $id: 'Address',
  type: ['object', 'null'],
  // None of these are required
  properties: {
    countryCode: { type: ['string', 'null'] },
    addressLine1: { type: 'string' },
    addressLine2: { type: ['string', 'null'] },
    administrativeArea: { type: ['string', 'null'] }, // Also known as state
    locality: { type: ['string', 'null'] }, // Also known as city
    postalCode: { type: ['string', 'null'] },

    // Not sure what these are for
    dependentLocality: { type: ['string', 'null'] },
    langcode: { type: ['string', 'null'] },
    sortingCode: { type: ['string', 'null'] },
    organization: { type: ['string', 'null'] },
    givenName: { type: ['string', 'null'] },
    familyName: { type: ['string', 'null'] },
  },
};
