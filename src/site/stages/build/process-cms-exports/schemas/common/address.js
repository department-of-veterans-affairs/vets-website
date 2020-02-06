/* eslint-disable camelcase */

module.exports = {
  $id: 'RawAddress',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      locality: { type: 'string' },
      administrative_area: { type: 'string' }, // Looks like this acts like 'state'
      country_code: { type: 'string' },
      address_line1: { type: ['string', 'null'] },
      address_line2: { type: ['string', 'null'] },
      dependent_locality: { type: ['string', 'null'] },
      postal_code: { type: ['string', 'null'] },
      sorting_code: { type: ['string', 'null'] },
      // Why are these even here???
      langcode: { type: ['string', 'null'] },
      given_name: { type: ['string', 'null'] },
      family_name: { type: ['string', 'null'] },
      additional_name: { type: ['string', 'null'] },
      organization: { type: ['string', 'null'] },
    },
    required: [
      'locality',
      'administrative_area',
      'country_code',
      'address_line1',
      'address_line2',
      'dependent_locality',
      'postal_code',
      'sorting_code',
      'langcode',
      'given_name',
      'family_name',
      'additional_name',
      'organization',
    ],
  },
};
