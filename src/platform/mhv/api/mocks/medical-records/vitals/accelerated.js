const all = {
  entry: [
    {
      fullUrl:
        'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjrXYfgnN',
      resource: {
        resourceType: 'Observation',
        id: '4-1bKlpYjrXYfgnN',
        meta: {
          lastUpdated: '2013-04-25T06:10:16Z',
        },
        status: 'final',
        category: [
          {
            coding: [
              {
                system:
                  'http://terminology.hl7.org/CodeSystem/observation-category',
                code: 'vital-signs',
                display: 'Vital Signs',
              },
            ],
            text: 'Vital Signs',
          },
        ],
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '85354-9',
              display: 'Blood Pressure',
            },
          ],
          text: 'Blood Pressure',
        },
        subject: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
          display: 'Mrs. Therese102 Un745 Oberbrunner298',
        },
        encounter: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9W4SB',
        },
        effectiveDateTime: '2013-03-26T06:10:16Z',
        issued: '2013-03-26T06:10:16Z',
        performer: [
          {
            reference:
              'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfQbW4eP',
            display: 'Dr. Francis500 Ratke343',
          },
          {
            reference:
              'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5ABdt3x',
            display: 'TEST VAMC',
          },
        ],
        interpretation: [
          {
            coding: [
              {
                system:
                  'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
                code: 'A',
                display: 'Abnormal',
              },
            ],
            text: 'A',
          },
        ],
        component: [
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8462-4',
                  display: 'Diastolic Blood Pressure',
                },
              ],
              text: 'Diastolic Blood Pressure',
            },
            valueQuantity: {
              value: 81,
              unit: 'mm Hg',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '8480-6',
                  display: 'Systolic Blood Pressure',
                },
              ],
              text: 'Systolic Blood Pressure',
            },
            valueQuantity: {
              value: 130,
              unit: 'mm Hg',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

module.exports = {
  all,
};
