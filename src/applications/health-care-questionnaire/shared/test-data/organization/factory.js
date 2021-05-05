class OrganizationData {
  constructor() {
    this.id = 'I2-AKOTGEFSVKFJOPUKHIVJAH5VQU000000';
    this.identifier = [
      {
        system: 'http://hl7.org/fhir/sid/us-npi',
        value: '1205983228',
      },
      {
        use: 'usual',
        type: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
              code: 'FI',
              display: 'Facility ID',
            },
          ],
          text: 'Facility ID',
        },
        system:
          'https://api.va.gov/services/fhir/v0/r4/NamingSystem/va-facility-identifier',
        value: 'vha_442',
      },
    ];
    this.active = true;
    this.name = 'NEW AMSTERDAM CBOC';

    this.telecom = [
      { system: 'phone', value: '800 555-7710' },
      { system: 'phone', value: '800 555-7720' },
      { system: 'phone', value: '800-555-7730' },
    ];
    this.address = [
      {
        text: '10 MONROE AVE, SUITE 6B PO BOX 4160 NEW AMSTERDAM OH 44444-4160',
        line: ['10 MONROE AVE, SUITE 6B', 'PO BOX 4160'],
        city: 'NEW AMSTERDAM',
        state: 'OH',
        postalCode: '44444-4160',
      },
    ];
    this.resourceType = 'Organization';
  }
}

export { OrganizationData };
