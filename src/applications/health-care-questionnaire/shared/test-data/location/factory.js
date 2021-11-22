class LocationData {
  withType(codingType) {
    this.type = [
      {
        coding: [
          {
            display: `${codingType}`,
          },
        ],
        text: `${codingType}`,
      },
    ];
    return this;
  }
  constructor() {
    this.id = 'I2-3JYDMXC6RXTU4H25KRVXATSEJQ000000';
    this.identifier = [
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
      {
        system:
          'https://api.va.gov/services/fhir/v0/r4/NamingSystem/va-clinic-identifier',
        value: 'vha_442_3049',
      },
    ];
    this.status = 'active';
    this.name = 'TEM MH PSO TRS IND93EH 2';
    this.description = 'BLDG 146, RM W02';
    this.mode = 'instance';
    this.type = [
      {
        coding: [
          {
            display: 'PSYCHIATRY CLINIC',
          },
        ],
        text: 'PSYCHIATRY CLINIC',
      },
    ];
    this.telecom = [
      {
        system: 'phone',
        value: '254-743-2867 x0002',
      },
    ];
    this.address = {
      text: '1901 VETERANS MEMORIAL DRIVE TEMPLE TEXAS 76504',
      line: ['1901 VETERANS MEMORIAL DRIVE'],
      city: 'TEMPLE',
      state: 'TEXAS',
      postalCode: '76504',
    };
    this.physicalType = {
      coding: [
        {
          display: 'BLDG 146, RM W02',
        },
      ],
      text: 'BLDG 146, RM W02',
    };
    this.managingLocation = {
      reference:
        'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/I2-AKOTGEFSVKFJOPUKHIVJAH5VQU000000',
      display: 'CHEYENNE VA MEDICAL',
    };

    this.resourceType = 'Location';
  }
}

export { LocationData };
