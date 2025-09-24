export default class MockProviderResponse {
  constructor({ id = 1 } = {}) {
    this.id = id.toString();
    this.type = 'provider';
    this.attributes = {
      address: {
        street: '1012 14TH ST NW STE 700',
        city: 'WASHINGTON',
        state: 'DC',
        zip: '20005-3477',
      },
      lat: 38.903195,
      long: -77.032382,
      name: 'Doe, Jane',
    };
  }

  static createResponses({ count = 1 } = {}) {
    return Array(count)
      .fill(count)
      .map((_, index) => new MockProviderResponse({ id: index }));
  }

  setLatitude(value) {
    this.attributes.lat = value;
    return this;
  }

  setLongitude(value) {
    this.attributes.long = value;
    return this;
  }

  setName(value) {
    this.attributes.name = value;
    return this;
  }
}
