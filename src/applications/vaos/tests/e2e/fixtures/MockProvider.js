export class MockProvider {
  constructor() {
    this.id = '1';
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

  setLatitude(value) {
    this.attributes.lat = value;
    return this;
  }

  setLongitude(value) {
    this.attributes.long = value;
    return this;
  }
}
