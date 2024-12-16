/* eslint-disable no-unused-vars */
const entries = [
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
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
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
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjrXau0Ob',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjrXau0Ob',
      meta: {
        lastUpdated: '2013-06-24T06:10:16Z',
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
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9WLVD',
      },
      effectiveDateTime: '2013-05-25T06:10:16Z',
      issued: '2013-05-25T06:10:16Z',
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
            value: 69,
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
            value: 103,
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
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjrXauYUf',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjrXauYUf',
      meta: {
        lastUpdated: '2014-01-31T06:10:16Z',
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
            code: '8302-2',
            display: 'Body Height',
          },
        ],
        text: 'Body Height',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9WcYF',
      },
      effectiveDateTime: '2014-01-01T06:10:16Z',
      issued: '2014-01-01T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 171.3,
        unit: 'cm',
        system: 'http://unitsofmeasure.org',
        code: 'cm',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjrXaupXh',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjrXaupXh',
      meta: {
        lastUpdated: '2014-01-31T06:10:16Z',
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
            code: '72514-3',
            display:
              'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
          },
        ],
        text: 'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9WcYF',
      },
      effectiveDateTime: '2014-01-01T06:10:16Z',
      issued: '2014-01-01T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 1,
        unit: 'Score',
        system: 'http://unitsofmeasure.org',
        code: '{score}',
      },
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
      referenceRange: [
        {
          low: {
            value: 20,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
          high: {
            value: 182,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
        },
      ],
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjrXav6aj',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjrXav6aj',
      meta: {
        lastUpdated: '2014-01-31T06:10:16Z',
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
            code: '29463-7',
            display: 'Body Weight',
          },
        ],
        text: 'Body Weight',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9WcYF',
      },
      effectiveDateTime: '2014-01-01T06:10:16Z',
      issued: '2014-01-01T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 88.6,
        unit: 'kg',
        system: 'http://unitsofmeasure.org',
        code: 'kg',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjrXavegn',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjrXavegn',
      meta: {
        lastUpdated: '2014-01-31T06:10:16Z',
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
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9WcYF',
      },
      effectiveDateTime: '2014-01-01T06:10:16Z',
      issued: '2014-01-01T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
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
            value: 69,
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
            value: 102,
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
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjrXavvjp',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjrXavvjp',
      meta: {
        lastUpdated: '2014-01-31T06:10:16Z',
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
            code: '8867-4',
            display: 'Heart rate',
          },
        ],
        text: 'Heart rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9WcYF',
      },
      effectiveDateTime: '2014-01-01T06:10:16Z',
      issued: '2014-01-01T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 98,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjrXawCmr',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjrXawCmr',
      meta: {
        lastUpdated: '2014-01-31T06:10:16Z',
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
            code: '9279-1',
            display: 'Respiratory rate',
          },
        ],
        text: 'Respiratory rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9WcYF',
      },
      effectiveDateTime: '2014-01-01T06:10:16Z',
      issued: '2014-01-01T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 14,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjrXfSPcj',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjrXfSPcj',
      meta: {
        lastUpdated: '2015-02-06T06:10:16Z',
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
            code: '8302-2',
            display: 'Body Height',
          },
        ],
        text: 'Body Height',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9XAeJ',
      },
      effectiveDateTime: '2015-01-07T06:10:16Z',
      issued: '2015-01-07T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 171.3,
        unit: 'cm',
        system: 'http://unitsofmeasure.org',
        code: 'cm',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjrXfSgfl',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjrXfSgfl',
      meta: {
        lastUpdated: '2015-02-06T06:10:16Z',
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
            code: '72514-3',
            display:
              'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
          },
        ],
        text: 'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9XAeJ',
      },
      effectiveDateTime: '2015-01-07T06:10:16Z',
      issued: '2015-01-07T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 4,
        unit: 'Score',
        system: 'http://unitsofmeasure.org',
        code: '{score}',
      },
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
      referenceRange: [
        {
          low: {
            value: 20,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
          high: {
            value: 182,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
        },
      ],
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjrXfSxin',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjrXfSxin',
      meta: {
        lastUpdated: '2015-02-06T06:10:16Z',
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
            code: '29463-7',
            display: 'Body Weight',
          },
        ],
        text: 'Body Weight',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9XAeJ',
      },
      effectiveDateTime: '2015-01-07T06:10:16Z',
      issued: '2015-01-07T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 88.6,
        unit: 'kg',
        system: 'http://unitsofmeasure.org',
        code: 'kg',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjrXfTVor',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjrXfTVor',
      meta: {
        lastUpdated: '2015-02-06T06:10:16Z',
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
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9XAeJ',
      },
      effectiveDateTime: '2015-01-07T06:10:16Z',
      issued: '2015-01-07T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
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
            value: 73,
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
            value: 108,
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
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjrXfTmrt',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjrXfTmrt',
      meta: {
        lastUpdated: '2015-02-06T06:10:16Z',
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
            code: '8867-4',
            display: 'Heart rate',
          },
        ],
        text: 'Heart rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9XAeJ',
      },
      effectiveDateTime: '2015-01-07T06:10:16Z',
      issued: '2015-01-07T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 86,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjrXfU3uv',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjrXfU3uv',
      meta: {
        lastUpdated: '2015-02-06T06:10:16Z',
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
            code: '9279-1',
            display: 'Respiratory rate',
          },
        ],
        text: 'Respiratory rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9XAeJ',
      },
      effectiveDateTime: '2015-01-07T06:10:16Z',
      issued: '2015-01-07T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 13,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjrqAEPDR',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjrqAEPDR',
      meta: {
        lastUpdated: '2016-02-12T06:10:16Z',
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
            code: '8302-2',
            display: 'Body Height',
          },
        ],
        text: 'Body Height',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9XRhL',
      },
      effectiveDateTime: '2016-01-13T06:10:16Z',
      issued: '2016-01-13T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 171.3,
        unit: 'cm',
        system: 'http://unitsofmeasure.org',
        code: 'cm',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjrqAEgGT',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjrqAEgGT',
      meta: {
        lastUpdated: '2016-02-12T06:10:16Z',
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
            code: '72514-3',
            display:
              'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
          },
        ],
        text: 'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9XRhL',
      },
      effectiveDateTime: '2016-01-13T06:10:16Z',
      issued: '2016-01-13T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 1,
        unit: 'Score',
        system: 'http://unitsofmeasure.org',
        code: '{score}',
      },
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
      referenceRange: [
        {
          low: {
            value: 20,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
          high: {
            value: 182,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
        },
      ],
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjrqAExJV',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjrqAExJV',
      meta: {
        lastUpdated: '2016-02-12T06:10:16Z',
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
            code: '29463-7',
            display: 'Body Weight',
          },
        ],
        text: 'Body Weight',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9XRhL',
      },
      effectiveDateTime: '2016-01-13T06:10:16Z',
      issued: '2016-01-13T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 88.6,
        unit: 'kg',
        system: 'http://unitsofmeasure.org',
        code: 'kg',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjrqAFVPZ',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjrqAFVPZ',
      meta: {
        lastUpdated: '2016-02-12T06:10:16Z',
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
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9XRhL',
      },
      effectiveDateTime: '2016-01-13T06:10:16Z',
      issued: '2016-01-13T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
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
            value: 66,
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
            value: 104,
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
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjrqCTp0n',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjrqCTp0n',
      meta: {
        lastUpdated: '2016-02-12T06:10:16Z',
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
            code: '8867-4',
            display: 'Heart rate',
          },
        ],
        text: 'Heart rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9XRhL',
      },
      effectiveDateTime: '2016-01-13T06:10:16Z',
      issued: '2016-01-13T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 65,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjrqCU63p',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjrqCU63p',
      meta: {
        lastUpdated: '2016-02-12T06:10:16Z',
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
            code: '9279-1',
            display: 'Respiratory rate',
          },
        ],
        text: 'Respiratory rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9XRhL',
      },
      effectiveDateTime: '2016-01-13T06:10:16Z',
      issued: '2016-01-13T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 13,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjrqLadT3',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjrqLadT3',
      meta: {
        lastUpdated: '2017-02-17T06:10:16Z',
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
            code: '8302-2',
            display: 'Body Height',
          },
        ],
        text: 'Body Height',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9XikN',
      },
      effectiveDateTime: '2017-01-18T06:10:16Z',
      issued: '2017-01-18T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 171.3,
        unit: 'cm',
        system: 'http://unitsofmeasure.org',
        code: 'cm',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjrqLauW5',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjrqLauW5',
      meta: {
        lastUpdated: '2017-02-17T06:10:16Z',
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
            code: '72514-3',
            display:
              'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
          },
        ],
        text: 'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9XikN',
      },
      effectiveDateTime: '2017-01-18T06:10:16Z',
      issued: '2017-01-18T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 3,
        unit: 'Score',
        system: 'http://unitsofmeasure.org',
        code: '{score}',
      },
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
      referenceRange: [
        {
          low: {
            value: 20,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
          high: {
            value: 182,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
        },
      ],
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjrqLbBZ7',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjrqLbBZ7',
      meta: {
        lastUpdated: '2017-02-17T06:10:16Z',
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
            code: '29463-7',
            display: 'Body Weight',
          },
        ],
        text: 'Body Weight',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9XikN',
      },
      effectiveDateTime: '2017-01-18T06:10:16Z',
      issued: '2017-01-18T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 88.6,
        unit: 'kg',
        system: 'http://unitsofmeasure.org',
        code: 'kg',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjrqNpmDN',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjrqNpmDN',
      meta: {
        lastUpdated: '2017-02-17T06:10:16Z',
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
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9XikN',
      },
      effectiveDateTime: '2017-01-18T06:10:16Z',
      issued: '2017-01-18T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
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
            value: 68,
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
            value: 102,
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
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjrqNq3GP',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjrqNq3GP',
      meta: {
        lastUpdated: '2017-02-17T06:10:16Z',
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
            code: '8867-4',
            display: 'Heart rate',
          },
        ],
        text: 'Heart rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9XikN',
      },
      effectiveDateTime: '2017-01-18T06:10:16Z',
      issued: '2017-01-18T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 76,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjrqNqKJR',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjrqNqKJR',
      meta: {
        lastUpdated: '2017-02-17T06:10:16Z',
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
            code: '9279-1',
            display: 'Respiratory rate',
          },
        ],
        text: 'Respiratory rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9XikN',
      },
      effectiveDateTime: '2017-01-18T06:10:16Z',
      issued: '2017-01-18T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 13,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjs8usYqb',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjs8usYqb',
      meta: {
        lastUpdated: '2017-12-15T06:10:16Z',
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
            code: '8302-2',
            display: 'Body Height',
          },
        ],
        text: 'Body Height',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9XznP',
      },
      effectiveDateTime: '2017-11-15T06:10:16Z',
      issued: '2017-11-15T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 171.3,
        unit: 'cm',
        system: 'http://unitsofmeasure.org',
        code: 'cm',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjs8usptd',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjs8usptd',
      meta: {
        lastUpdated: '2017-12-15T06:10:16Z',
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
            code: '72514-3',
            display:
              'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
          },
        ],
        text: 'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9XznP',
      },
      effectiveDateTime: '2017-11-15T06:10:16Z',
      issued: '2017-11-15T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 3,
        unit: 'Score',
        system: 'http://unitsofmeasure.org',
        code: '{score}',
      },
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
      referenceRange: [
        {
          low: {
            value: 20,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
          high: {
            value: 182,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
        },
      ],
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjs8ut6wf',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjs8ut6wf',
      meta: {
        lastUpdated: '2017-12-15T06:10:16Z',
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
            code: '29463-7',
            display: 'Body Weight',
          },
        ],
        text: 'Body Weight',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9XznP',
      },
      effectiveDateTime: '2017-11-15T06:10:16Z',
      issued: '2017-11-15T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 88.6,
        unit: 'kg',
        system: 'http://unitsofmeasure.org',
        code: 'kg',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjs8utf2j',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjs8utf2j',
      meta: {
        lastUpdated: '2017-12-15T06:10:16Z',
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
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9XznP',
      },
      effectiveDateTime: '2017-11-15T06:10:16Z',
      issued: '2017-11-15T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
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
            value: 71,
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
            value: 115,
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
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjs8utw5l',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjs8utw5l',
      meta: {
        lastUpdated: '2017-12-15T06:10:16Z',
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
            code: '8867-4',
            display: 'Heart rate',
          },
        ],
        text: 'Heart rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9XznP',
      },
      effectiveDateTime: '2017-11-15T06:10:16Z',
      issued: '2017-11-15T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 72,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjs8uuD8n',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjs8uuD8n',
      meta: {
        lastUpdated: '2017-12-15T06:10:16Z',
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
            code: '9279-1',
            display: 'Respiratory rate',
          },
        ],
        text: 'Respiratory rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9XznP',
      },
      effectiveDateTime: '2017-11-15T06:10:16Z',
      issued: '2017-11-15T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 13,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjs93z6Fp',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjs93z6Fp',
      meta: {
        lastUpdated: '2018-02-23T06:10:16Z',
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
            code: '8302-2',
            display: 'Body Height',
          },
        ],
        text: 'Body Height',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9YGqR',
      },
      effectiveDateTime: '2018-01-24T06:10:16Z',
      issued: '2018-01-24T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 171.3,
        unit: 'cm',
        system: 'http://unitsofmeasure.org',
        code: 'cm',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjs93zNIr',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjs93zNIr',
      meta: {
        lastUpdated: '2018-02-23T06:10:16Z',
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
            code: '72514-3',
            display:
              'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
          },
        ],
        text: 'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9YGqR',
      },
      effectiveDateTime: '2018-01-24T06:10:16Z',
      issued: '2018-01-24T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 4,
        unit: 'Score',
        system: 'http://unitsofmeasure.org',
        code: '{score}',
      },
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
      referenceRange: [
        {
          low: {
            value: 20,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
          high: {
            value: 182,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
        },
      ],
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjs93zeLt',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjs93zeLt',
      meta: {
        lastUpdated: '2018-02-23T06:10:16Z',
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
            code: '29463-7',
            display: 'Body Weight',
          },
        ],
        text: 'Body Weight',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9YGqR',
      },
      effectiveDateTime: '2018-01-24T06:10:16Z',
      issued: '2018-01-24T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 88.6,
        unit: 'kg',
        system: 'http://unitsofmeasure.org',
        code: 'kg',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjs96EF09',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjs96EF09',
      meta: {
        lastUpdated: '2018-02-23T06:10:16Z',
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
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9YGqR',
      },
      effectiveDateTime: '2018-01-24T06:10:16Z',
      issued: '2018-01-24T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
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
            value: 66,
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
            value: 113,
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
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjs96EW3B',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjs96EW3B',
      meta: {
        lastUpdated: '2018-02-23T06:10:16Z',
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
            code: '8867-4',
            display: 'Heart rate',
          },
        ],
        text: 'Heart rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9YGqR',
      },
      effectiveDateTime: '2018-01-24T06:10:16Z',
      issued: '2018-01-24T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 91,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYjs96En6D',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYjs96En6D',
      meta: {
        lastUpdated: '2018-02-23T06:10:16Z',
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
            code: '9279-1',
            display: 'Respiratory rate',
          },
        ],
        text: 'Respiratory rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9YGqR',
      },
      effectiveDateTime: '2018-01-24T06:10:16Z',
      issued: '2018-01-24T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 15,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKHR4aGr',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKHR4aGr',
      meta: {
        lastUpdated: '2018-08-10T06:10:16Z',
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
            code: '8302-2',
            display: 'Body Height',
          },
        ],
        text: 'Body Height',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9YXtT',
      },
      effectiveDateTime: '2018-07-11T06:10:16Z',
      issued: '2018-07-11T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 171.3,
        unit: 'cm',
        system: 'http://unitsofmeasure.org',
        code: 'cm',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKHR4rJt',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKHR4rJt',
      meta: {
        lastUpdated: '2018-08-10T06:10:16Z',
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
            code: '72514-3',
            display:
              'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
          },
        ],
        text: 'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9YXtT',
      },
      effectiveDateTime: '2018-07-11T06:10:16Z',
      issued: '2018-07-11T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 1,
        unit: 'Score',
        system: 'http://unitsofmeasure.org',
        code: '{score}',
      },
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
      referenceRange: [
        {
          low: {
            value: 20,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
          high: {
            value: 182,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
        },
      ],
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKHR58Mv',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKHR58Mv',
      meta: {
        lastUpdated: '2018-08-10T06:10:16Z',
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
            code: '29463-7',
            display: 'Body Weight',
          },
        ],
        text: 'Body Weight',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9YXtT',
      },
      effectiveDateTime: '2018-07-11T06:10:16Z',
      issued: '2018-07-11T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 88.6,
        unit: 'kg',
        system: 'http://unitsofmeasure.org',
        code: 'kg',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKHR5gSz',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKHR5gSz',
      meta: {
        lastUpdated: '2018-08-10T06:10:16Z',
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
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9YXtT',
      },
      effectiveDateTime: '2018-07-11T06:10:16Z',
      issued: '2018-07-11T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
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
            value: 68,
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
            value: 109,
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
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKHR5xW1',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKHR5xW1',
      meta: {
        lastUpdated: '2018-08-10T06:10:16Z',
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
            code: '8867-4',
            display: 'Heart rate',
          },
        ],
        text: 'Heart rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9YXtT',
      },
      effectiveDateTime: '2018-07-11T06:10:16Z',
      issued: '2018-07-11T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 82,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKHR6EZ3',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKHR6EZ3',
      meta: {
        lastUpdated: '2018-08-10T06:10:16Z',
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
            code: '9279-1',
            display: 'Respiratory rate',
          },
        ],
        text: 'Respiratory rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9YXtT',
      },
      effectiveDateTime: '2018-07-11T06:10:16Z',
      issued: '2018-07-11T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 14,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKHaBfm9',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKHaBfm9',
      meta: {
        lastUpdated: '2019-03-01T06:10:16Z',
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
            code: '8302-2',
            display: 'Body Height',
          },
        ],
        text: 'Body Height',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZBmrUh',
      },
      effectiveDateTime: '2019-01-30T06:10:16Z',
      issued: '2019-01-30T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 171.3,
        unit: 'cm',
        system: 'http://unitsofmeasure.org',
        code: 'cm',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKHaBwpB',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKHaBwpB',
      meta: {
        lastUpdated: '2019-03-01T06:10:16Z',
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
            code: '72514-3',
            display:
              'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
          },
        ],
        text: 'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZBmrUh',
      },
      effectiveDateTime: '2019-01-30T06:10:16Z',
      issued: '2019-01-30T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 4,
        unit: 'Score',
        system: 'http://unitsofmeasure.org',
        code: '{score}',
      },
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
      referenceRange: [
        {
          low: {
            value: 20,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
          high: {
            value: 182,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
        },
      ],
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKHcQGQP',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKHcQGQP',
      meta: {
        lastUpdated: '2019-03-01T06:10:16Z',
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
            code: '29463-7',
            display: 'Body Weight',
          },
        ],
        text: 'Body Weight',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZBmrUh',
      },
      effectiveDateTime: '2019-01-30T06:10:16Z',
      issued: '2019-01-30T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 88.6,
        unit: 'kg',
        system: 'http://unitsofmeasure.org',
        code: 'kg',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKHcQoWT',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKHcQoWT',
      meta: {
        lastUpdated: '2019-03-01T06:10:16Z',
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
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZBmrUh',
      },
      effectiveDateTime: '2019-01-30T06:10:16Z',
      issued: '2019-01-30T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
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
            value: 75,
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
            value: 102,
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
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKHcR5ZV',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKHcR5ZV',
      meta: {
        lastUpdated: '2019-03-01T06:10:16Z',
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
            code: '8867-4',
            display: 'Heart rate',
          },
        ],
        text: 'Heart rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZBmrUh',
      },
      effectiveDateTime: '2019-01-30T06:10:16Z',
      issued: '2019-01-30T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 97,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKHcRMcX',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKHcRMcX',
      meta: {
        lastUpdated: '2019-03-01T06:10:16Z',
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
            code: '9279-1',
            display: 'Respiratory rate',
          },
        ],
        text: 'Respiratory rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZBmrUh',
      },
      effectiveDateTime: '2019-01-30T06:10:16Z',
      issued: '2019-01-30T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 14,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKHlXLvh',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKHlXLvh',
      meta: {
        lastUpdated: '2020-02-28T06:10:16Z',
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
            code: '8302-2',
            display: 'Body Height',
          },
        ],
        text: 'Body Height',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZBompv',
      },
      effectiveDateTime: '2020-01-29T06:10:16Z',
      issued: '2020-01-29T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 171.3,
        unit: 'cm',
        system: 'http://unitsofmeasure.org',
        code: 'cm',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKHlXcyj',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKHlXcyj',
      meta: {
        lastUpdated: '2020-02-28T06:10:16Z',
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
            code: '72514-3',
            display:
              'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
          },
        ],
        text: 'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZBompv',
      },
      effectiveDateTime: '2020-01-29T06:10:16Z',
      issued: '2020-01-29T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 1,
        unit: 'Score',
        system: 'http://unitsofmeasure.org',
        code: '{score}',
      },
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
      referenceRange: [
        {
          low: {
            value: 20,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
          high: {
            value: 182,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
        },
      ],
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKHlXu1l',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKHlXu1l',
      meta: {
        lastUpdated: '2020-02-28T06:10:16Z',
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
            code: '29463-7',
            display: 'Body Weight',
          },
        ],
        text: 'Body Weight',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZBompv',
      },
      effectiveDateTime: '2020-01-29T06:10:16Z',
      issued: '2020-01-29T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 80.3,
        unit: 'kg',
        system: 'http://unitsofmeasure.org',
        code: 'kg',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKaBjZ37',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKaBjZ37',
      meta: {
        lastUpdated: '2020-02-28T06:10:16Z',
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
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZBompv',
      },
      effectiveDateTime: '2020-01-29T06:10:16Z',
      issued: '2020-01-29T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
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
            value: 71,
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
            value: 108,
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
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKaBjq69',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKaBjq69',
      meta: {
        lastUpdated: '2020-02-28T06:10:16Z',
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
            code: '8867-4',
            display: 'Heart rate',
          },
        ],
        text: 'Heart rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZBompv',
      },
      effectiveDateTime: '2020-01-29T06:10:16Z',
      issued: '2020-01-29T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 81,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKaBk79B',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKaBk79B',
      meta: {
        lastUpdated: '2020-02-28T06:10:16Z',
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
            code: '9279-1',
            display: 'Respiratory rate',
          },
        ],
        text: 'Respiratory rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZBompv',
      },
      effectiveDateTime: '2020-01-29T06:10:16Z',
      issued: '2020-01-29T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 15,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKaN6cRp',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKaN6cRp',
      meta: {
        lastUpdated: '2020-03-13T06:10:16Z',
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
            code: '8302-2',
            display: 'Body Height',
          },
        ],
        text: 'Body Height',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZBp3sx',
      },
      effectiveDateTime: '2020-02-12T06:10:16Z',
      issued: '2020-02-12T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 171.3,
        unit: 'cm',
        system: 'http://unitsofmeasure.org',
        code: 'cm',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKaN6tUr',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKaN6tUr',
      meta: {
        lastUpdated: '2020-03-13T06:10:16Z',
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
            code: '72514-3',
            display:
              'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
          },
        ],
        text: 'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZBp3sx',
      },
      effectiveDateTime: '2020-02-12T06:10:16Z',
      issued: '2020-02-12T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 2,
        unit: 'Score',
        system: 'http://unitsofmeasure.org',
        code: '{score}',
      },
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
      referenceRange: [
        {
          low: {
            value: 20,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
          high: {
            value: 182,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
        },
      ],
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKaN7AXt',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKaN7AXt',
      meta: {
        lastUpdated: '2020-03-13T06:10:16Z',
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
            code: '29463-7',
            display: 'Body Weight',
          },
        ],
        text: 'Body Weight',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZBp3sx',
      },
      effectiveDateTime: '2020-02-12T06:10:16Z',
      issued: '2020-02-12T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 80.3,
        unit: 'kg',
        system: 'http://unitsofmeasure.org',
        code: 'kg',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKaN7idx',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKaN7idx',
      meta: {
        lastUpdated: '2020-03-13T06:10:16Z',
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
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZBp3sx',
      },
      effectiveDateTime: '2020-02-12T06:10:16Z',
      issued: '2020-02-12T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
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
            value: 68,
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
            value: 101,
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
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKaPM2FB',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKaPM2FB',
      meta: {
        lastUpdated: '2020-03-13T06:10:16Z',
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
            code: '8867-4',
            display: 'Heart rate',
          },
        ],
        text: 'Heart rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZBp3sx',
      },
      effectiveDateTime: '2020-02-12T06:10:16Z',
      issued: '2020-02-12T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 96,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKaPMJID',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKaPMJID',
      meta: {
        lastUpdated: '2020-03-13T06:10:16Z',
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
            code: '9279-1',
            display: 'Respiratory rate',
          },
        ],
        text: 'Respiratory rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZBp3sx',
      },
      effectiveDateTime: '2020-02-12T06:10:16Z',
      issued: '2020-02-12T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 14,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKswOXpN',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKswOXpN',
      meta: {
        lastUpdated: '2020-05-29T06:10:16Z',
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
            code: '8302-2',
            display: 'Body Height',
          },
        ],
        text: 'Body Height',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZBpKvz',
      },
      effectiveDateTime: '2020-04-29T06:10:16Z',
      issued: '2020-04-29T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 171.3,
        unit: 'cm',
        system: 'http://unitsofmeasure.org',
        code: 'cm',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKswOosP',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKswOosP',
      meta: {
        lastUpdated: '2020-05-29T06:10:16Z',
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
            code: '72514-3',
            display:
              'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
          },
        ],
        text: 'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZBpKvz',
      },
      effectiveDateTime: '2020-04-29T06:10:16Z',
      issued: '2020-04-29T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 3,
        unit: 'Score',
        system: 'http://unitsofmeasure.org',
        code: '{score}',
      },
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
      referenceRange: [
        {
          low: {
            value: 20,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
          high: {
            value: 182,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
        },
      ],
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKswP5vR',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKswP5vR',
      meta: {
        lastUpdated: '2020-05-29T06:10:16Z',
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
            code: '29463-7',
            display: 'Body Weight',
          },
        ],
        text: 'Body Weight',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZBpKvz',
      },
      effectiveDateTime: '2020-04-29T06:10:16Z',
      issued: '2020-04-29T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 80.8,
        unit: 'kg',
        system: 'http://unitsofmeasure.org',
        code: 'kg',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKswPe1V',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKswPe1V',
      meta: {
        lastUpdated: '2020-05-29T06:10:16Z',
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
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZBpKvz',
      },
      effectiveDateTime: '2020-04-29T06:10:16Z',
      issued: '2020-04-29T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
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
            value: 69,
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
            value: 103,
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
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKswPv4X',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKswPv4X',
      meta: {
        lastUpdated: '2020-05-29T06:10:16Z',
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
            code: '8867-4',
            display: 'Heart rate',
          },
        ],
        text: 'Heart rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZBpKvz',
      },
      effectiveDateTime: '2020-04-29T06:10:16Z',
      issued: '2020-04-29T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 92,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKswQC7Z',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKswQC7Z',
      meta: {
        lastUpdated: '2020-05-29T06:10:16Z',
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
            code: '9279-1',
            display: 'Respiratory rate',
          },
        ],
        text: 'Respiratory rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZBpKvz',
      },
      effectiveDateTime: '2020-04-29T06:10:16Z',
      issued: '2020-04-29T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 12,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKt5VMHd',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKt5VMHd',
      meta: {
        lastUpdated: '2020-07-31T06:10:16Z',
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
            code: '8302-2',
            display: 'Body Height',
          },
        ],
        text: 'Body Height',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE3eXD',
      },
      effectiveDateTime: '2020-07-01T06:10:16Z',
      issued: '2020-07-01T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 171.3,
        unit: 'cm',
        system: 'http://unitsofmeasure.org',
        code: 'cm',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKt5VdKf',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKt5VdKf',
      meta: {
        lastUpdated: '2020-07-31T06:10:16Z',
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
            code: '72514-3',
            display:
              'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
          },
        ],
        text: 'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE3eXD',
      },
      effectiveDateTime: '2020-07-01T06:10:16Z',
      issued: '2020-07-01T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 2,
        unit: 'Score',
        system: 'http://unitsofmeasure.org',
        code: '{score}',
      },
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
      referenceRange: [
        {
          low: {
            value: 20,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
          high: {
            value: 182,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
        },
      ],
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKt5VuNh',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKt5VuNh',
      meta: {
        lastUpdated: '2020-07-31T06:10:16Z',
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
            code: '29463-7',
            display: 'Body Weight',
          },
        ],
        text: 'Body Weight',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE3eXD',
      },
      effectiveDateTime: '2020-07-01T06:10:16Z',
      issued: '2020-07-01T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 81.1,
        unit: 'kg',
        system: 'http://unitsofmeasure.org',
        code: 'kg',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKt7kV1x',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKt7kV1x',
      meta: {
        lastUpdated: '2020-07-31T06:10:16Z',
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
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE3eXD',
      },
      effectiveDateTime: '2020-07-01T06:10:16Z',
      issued: '2020-07-01T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
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
            value: 68,
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
            value: 104,
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
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKt7km4z',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKt7km4z',
      meta: {
        lastUpdated: '2020-07-31T06:10:16Z',
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
            code: '8867-4',
            display: 'Heart rate',
          },
        ],
        text: 'Heart rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE3eXD',
      },
      effectiveDateTime: '2020-07-01T06:10:16Z',
      issued: '2020-07-01T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 90,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKt7l381',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKt7l381',
      meta: {
        lastUpdated: '2020-07-31T06:10:16Z',
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
            code: '9279-1',
            display: 'Respiratory rate',
          },
        ],
        text: 'Respiratory rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE3eXD',
      },
      effectiveDateTime: '2020-07-01T06:10:16Z',
      issued: '2020-07-01T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 13,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKtGqDI5',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKtGqDI5',
      meta: {
        lastUpdated: '2020-08-28T06:10:16Z',
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
            code: '8302-2',
            display: 'Body Height',
          },
        ],
        text: 'Body Height',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE3vaF',
      },
      effectiveDateTime: '2020-07-29T06:10:16Z',
      issued: '2020-07-29T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 171.3,
        unit: 'cm',
        system: 'http://unitsofmeasure.org',
        code: 'cm',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKtGqUL7',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKtGqUL7',
      meta: {
        lastUpdated: '2020-08-28T06:10:16Z',
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
            code: '72514-3',
            display:
              'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
          },
        ],
        text: 'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE3vaF',
      },
      effectiveDateTime: '2020-07-29T06:10:16Z',
      issued: '2020-07-29T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 2,
        unit: 'Score',
        system: 'http://unitsofmeasure.org',
        code: '{score}',
      },
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
      referenceRange: [
        {
          low: {
            value: 20,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
          high: {
            value: 182,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
        },
      ],
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKtGqlO9',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKtGqlO9',
      meta: {
        lastUpdated: '2020-08-28T06:10:16Z',
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
            code: '29463-7',
            display: 'Body Weight',
          },
        ],
        text: 'Body Weight',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE3vaF',
      },
      effectiveDateTime: '2020-07-29T06:10:16Z',
      issued: '2020-07-29T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 81.3,
        unit: 'kg',
        system: 'http://unitsofmeasure.org',
        code: 'kg',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKtGrJUD',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKtGrJUD',
      meta: {
        lastUpdated: '2020-08-28T06:10:16Z',
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
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE3vaF',
      },
      effectiveDateTime: '2020-07-29T06:10:16Z',
      issued: '2020-07-29T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
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
            value: 76,
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
            value: 101,
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
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKtGraXF',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKtGraXF',
      meta: {
        lastUpdated: '2020-08-28T06:10:16Z',
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
            code: '8867-4',
            display: 'Heart rate',
          },
        ],
        text: 'Heart rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE3vaF',
      },
      effectiveDateTime: '2020-07-29T06:10:16Z',
      issued: '2020-07-29T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 86,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmKtGrraH',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmKtGrraH',
      meta: {
        lastUpdated: '2020-08-28T06:10:16Z',
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
            code: '9279-1',
            display: 'Respiratory rate',
          },
        ],
        text: 'Respiratory rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE3vaF',
      },
      effectiveDateTime: '2020-07-29T06:10:16Z',
      issued: '2020-07-29T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 13,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLBnu67R',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLBnu67R',
      meta: {
        lastUpdated: '2020-12-25T06:10:16Z',
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
            code: '8302-2',
            display: 'Body Height',
          },
        ],
        text: 'Body Height',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE4CdH',
      },
      effectiveDateTime: '2020-11-25T06:10:16Z',
      issued: '2020-11-25T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 171.3,
        unit: 'cm',
        system: 'http://unitsofmeasure.org',
        code: 'cm',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLBq8Pif',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLBq8Pif',
      meta: {
        lastUpdated: '2020-12-25T06:10:16Z',
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
            code: '72514-3',
            display:
              'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
          },
        ],
        text: 'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE4CdH',
      },
      effectiveDateTime: '2020-11-25T06:10:16Z',
      issued: '2020-11-25T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 3,
        unit: 'Score',
        system: 'http://unitsofmeasure.org',
        code: '{score}',
      },
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
      referenceRange: [
        {
          low: {
            value: 20,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
          high: {
            value: 182,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
        },
      ],
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLBq8glh',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLBq8glh',
      meta: {
        lastUpdated: '2020-12-25T06:10:16Z',
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
            code: '29463-7',
            display: 'Body Weight',
          },
        ],
        text: 'Body Weight',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE4CdH',
      },
      effectiveDateTime: '2020-11-25T06:10:16Z',
      issued: '2020-11-25T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 82,
        unit: 'kg',
        system: 'http://unitsofmeasure.org',
        code: 'kg',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLBq9Erl',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLBq9Erl',
      meta: {
        lastUpdated: '2020-12-25T06:10:16Z',
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
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE4CdH',
      },
      effectiveDateTime: '2020-11-25T06:10:16Z',
      issued: '2020-11-25T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
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
            value: 69,
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
            value: 105,
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
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLBq9Vun',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLBq9Vun',
      meta: {
        lastUpdated: '2020-12-25T06:10:16Z',
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
            code: '8867-4',
            display: 'Heart rate',
          },
        ],
        text: 'Heart rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE4CdH',
      },
      effectiveDateTime: '2020-11-25T06:10:16Z',
      issued: '2020-11-25T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 73,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLBq9mxp',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLBq9mxp',
      meta: {
        lastUpdated: '2020-12-25T06:10:16Z',
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
            code: '9279-1',
            display: 'Respiratory rate',
          },
        ],
        text: 'Respiratory rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE4CdH',
      },
      effectiveDateTime: '2020-11-25T06:10:16Z',
      issued: '2020-11-25T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 15,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLBzEx7t',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLBzEx7t',
      meta: {
        lastUpdated: '2021-03-19T06:10:16Z',
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
            code: '8302-2',
            display: 'Body Height',
          },
        ],
        text: 'Body Height',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE4TgJ',
      },
      effectiveDateTime: '2021-02-17T06:10:16Z',
      issued: '2021-02-17T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 171.3,
        unit: 'cm',
        system: 'http://unitsofmeasure.org',
        code: 'cm',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLBzFEAv',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLBzFEAv',
      meta: {
        lastUpdated: '2021-03-19T06:10:16Z',
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
            code: '72514-3',
            display:
              'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
          },
        ],
        text: 'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE4TgJ',
      },
      effectiveDateTime: '2021-02-17T06:10:16Z',
      issued: '2021-02-17T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 1,
        unit: 'Score',
        system: 'http://unitsofmeasure.org',
        code: '{score}',
      },
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
      referenceRange: [
        {
          low: {
            value: 20,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
          high: {
            value: 182,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
        },
      ],
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLBzFVDx',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLBzFVDx',
      meta: {
        lastUpdated: '2021-03-19T06:10:16Z',
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
            code: '29463-7',
            display: 'Body Weight',
          },
        ],
        text: 'Body Weight',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE4TgJ',
      },
      effectiveDateTime: '2021-02-17T06:10:16Z',
      issued: '2021-02-17T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 82.5,
        unit: 'kg',
        system: 'http://unitsofmeasure.org',
        code: 'kg',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLBzG3K1',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLBzG3K1',
      meta: {
        lastUpdated: '2021-03-19T06:10:16Z',
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
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE4TgJ',
      },
      effectiveDateTime: '2021-02-17T06:10:16Z',
      issued: '2021-02-17T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
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
            value: 70,
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
            value: 105,
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
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLC1UMvF',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLC1UMvF',
      meta: {
        lastUpdated: '2021-03-19T06:10:16Z',
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
            code: '8867-4',
            display: 'Heart rate',
          },
        ],
        text: 'Heart rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE4TgJ',
      },
      effectiveDateTime: '2021-02-17T06:10:16Z',
      issued: '2021-02-17T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 61,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLC1UdyH',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLC1UdyH',
      meta: {
        lastUpdated: '2021-03-19T06:10:16Z',
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
            code: '9279-1',
            display: 'Respiratory rate',
          },
        ],
        text: 'Respiratory rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE4TgJ',
      },
      effectiveDateTime: '2021-02-17T06:10:16Z',
      issued: '2021-02-17T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 13,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLUYX9YT',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLUYX9YT',
      meta: {
        lastUpdated: '2021-07-23T06:10:16Z',
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
            code: '8302-2',
            display: 'Body Height',
          },
        ],
        text: 'Body Height',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE4kjL',
      },
      effectiveDateTime: '2021-06-23T06:10:16Z',
      issued: '2021-06-23T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 171.3,
        unit: 'cm',
        system: 'http://unitsofmeasure.org',
        code: 'cm',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLUYXQbV',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLUYXQbV',
      meta: {
        lastUpdated: '2021-07-23T06:10:16Z',
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
            code: '72514-3',
            display:
              'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
          },
        ],
        text: 'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE4kjL',
      },
      effectiveDateTime: '2021-06-23T06:10:16Z',
      issued: '2021-06-23T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 3,
        unit: 'Score',
        system: 'http://unitsofmeasure.org',
        code: '{score}',
      },
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
      referenceRange: [
        {
          low: {
            value: 20,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
          high: {
            value: 182,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
        },
      ],
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLUYXheX',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLUYXheX',
      meta: {
        lastUpdated: '2021-07-23T06:10:16Z',
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
            code: '29463-7',
            display: 'Body Weight',
          },
        ],
        text: 'Body Weight',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE4kjL',
      },
      effectiveDateTime: '2021-06-23T06:10:16Z',
      issued: '2021-06-23T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 83.2,
        unit: 'kg',
        system: 'http://unitsofmeasure.org',
        code: 'kg',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLUYYFkb',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLUYYFkb',
      meta: {
        lastUpdated: '2021-07-23T06:10:16Z',
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
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE4kjL',
      },
      effectiveDateTime: '2021-06-23T06:10:16Z',
      issued: '2021-06-23T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
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
            value: 69,
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
            value: 100,
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
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLUYYWnd',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLUYYWnd',
      meta: {
        lastUpdated: '2021-07-23T06:10:16Z',
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
            code: '8867-4',
            display: 'Heart rate',
          },
        ],
        text: 'Heart rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE4kjL',
      },
      effectiveDateTime: '2021-06-23T06:10:16Z',
      issued: '2021-06-23T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 84,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLUYYnqf',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLUYYnqf',
      meta: {
        lastUpdated: '2021-07-23T06:10:16Z',
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
            code: '9279-1',
            display: 'Respiratory rate',
          },
        ],
        text: 'Respiratory rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE4kjL',
      },
      effectiveDateTime: '2021-06-23T06:10:16Z',
      issued: '2021-06-23T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 14,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLUhdy0j',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLUhdy0j',
      meta: {
        lastUpdated: '2022-03-25T06:10:16Z',
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
            code: '8302-2',
            display: 'Body Height',
          },
        ],
        text: 'Body Height',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE51mN',
      },
      effectiveDateTime: '2022-02-23T06:10:16Z',
      issued: '2022-02-23T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 171.3,
        unit: 'cm',
        system: 'http://unitsofmeasure.org',
        code: 'cm',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLUheF3l',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLUheF3l',
      meta: {
        lastUpdated: '2022-03-25T06:10:16Z',
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
            code: '72514-3',
            display:
              'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
          },
        ],
        text: 'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE51mN',
      },
      effectiveDateTime: '2022-02-23T06:10:16Z',
      issued: '2022-02-23T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 3,
        unit: 'Score',
        system: 'http://unitsofmeasure.org',
        code: '{score}',
      },
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
      referenceRange: [
        {
          low: {
            value: 20,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
          high: {
            value: 182,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
        },
      ],
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLUjsYez',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLUjsYez',
      meta: {
        lastUpdated: '2022-03-25T06:10:16Z',
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
            code: '29463-7',
            display: 'Body Weight',
          },
        ],
        text: 'Body Weight',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE51mN',
      },
      effectiveDateTime: '2022-02-23T06:10:16Z',
      issued: '2022-02-23T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 84.6,
        unit: 'kg',
        system: 'http://unitsofmeasure.org',
        code: 'kg',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLUjt6l3',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLUjt6l3',
      meta: {
        lastUpdated: '2022-03-25T06:10:16Z',
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
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE51mN',
      },
      effectiveDateTime: '2022-02-23T06:10:16Z',
      issued: '2022-02-23T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
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
            value: 66,
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
            value: 106,
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
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLUjtNo5',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLUjtNo5',
      meta: {
        lastUpdated: '2022-03-25T06:10:16Z',
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
            code: '8867-4',
            display: 'Heart rate',
          },
        ],
        text: 'Heart rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE51mN',
      },
      effectiveDateTime: '2022-02-23T06:10:16Z',
      issued: '2022-02-23T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 99,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLUjter7',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLUjter7',
      meta: {
        lastUpdated: '2022-03-25T06:10:16Z',
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
            code: '9279-1',
            display: 'Respiratory rate',
          },
        ],
        text: 'Respiratory rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE51mN',
      },
      effectiveDateTime: '2022-02-23T06:10:16Z',
      issued: '2022-02-23T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MfRBrHOj',
          display: 'Dr. Emilie407 Hermiston71',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-5pFm5BMKIYb',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 15,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLnGxGdR',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLnGxGdR',
      meta: {
        lastUpdated: '2022-09-16T06:10:16Z',
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
            code: '8302-2',
            display: 'Body Height',
          },
        ],
        text: 'Body Height',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE5IpP',
      },
      effectiveDateTime: '2022-08-17T06:10:16Z',
      issued: '2022-08-17T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 171.3,
        unit: 'cm',
        system: 'http://unitsofmeasure.org',
        code: 'cm',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLnJBaEf',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLnJBaEf',
      meta: {
        lastUpdated: '2022-09-16T06:10:16Z',
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
            code: '72514-3',
            display:
              'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
          },
        ],
        text: 'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE5IpP',
      },
      effectiveDateTime: '2022-08-17T06:10:16Z',
      issued: '2022-08-17T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 3,
        unit: 'Score',
        system: 'http://unitsofmeasure.org',
        code: '{score}',
      },
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
      referenceRange: [
        {
          low: {
            value: 20,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
          high: {
            value: 182,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
        },
      ],
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLnJBrHh',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLnJBrHh',
      meta: {
        lastUpdated: '2022-09-16T06:10:16Z',
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
            code: '29463-7',
            display: 'Body Weight',
          },
        ],
        text: 'Body Weight',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE5IpP',
      },
      effectiveDateTime: '2022-08-17T06:10:16Z',
      issued: '2022-08-17T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 85.6,
        unit: 'kg',
        system: 'http://unitsofmeasure.org',
        code: 'kg',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLnJCPNl',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLnJCPNl',
      meta: {
        lastUpdated: '2022-09-16T06:10:16Z',
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
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE5IpP',
      },
      effectiveDateTime: '2022-08-17T06:10:16Z',
      issued: '2022-08-17T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
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
            value: 73,
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
            value: 104,
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
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLnJCgQn',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLnJCgQn',
      meta: {
        lastUpdated: '2022-09-16T06:10:16Z',
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
            code: '8867-4',
            display: 'Heart rate',
          },
        ],
        text: 'Heart rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE5IpP',
      },
      effectiveDateTime: '2022-08-17T06:10:16Z',
      issued: '2022-08-17T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 66,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLnJCxTp',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLnJCxTp',
      meta: {
        lastUpdated: '2022-09-16T06:10:16Z',
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
            code: '9279-1',
            display: 'Respiratory rate',
          },
        ],
        text: 'Respiratory rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE5IpP',
      },
      effectiveDateTime: '2022-08-17T06:10:16Z',
      issued: '2022-08-17T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 15,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLnSHqar',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLnSHqar',
      meta: {
        lastUpdated: '2022-12-16T06:10:16Z',
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
            code: '8302-2',
            display: 'Body Height',
          },
        ],
        text: 'Body Height',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE5ZsR',
      },
      effectiveDateTime: '2022-11-16T06:10:16Z',
      issued: '2022-11-16T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 171.3,
        unit: 'cm',
        system: 'http://unitsofmeasure.org',
        code: 'cm',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLnSI7dt',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLnSI7dt',
      meta: {
        lastUpdated: '2022-12-16T06:10:16Z',
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
            code: '72514-3',
            display:
              'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
          },
        ],
        text: 'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE5ZsR',
      },
      effectiveDateTime: '2022-11-16T06:10:16Z',
      issued: '2022-11-16T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 1,
        unit: 'Score',
        system: 'http://unitsofmeasure.org',
        code: '{score}',
      },
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
      referenceRange: [
        {
          low: {
            value: 20,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
          high: {
            value: 182,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
        },
      ],
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLnSIOgv',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLnSIOgv',
      meta: {
        lastUpdated: '2022-12-16T06:10:16Z',
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
            code: '29463-7',
            display: 'Body Weight',
          },
        ],
        text: 'Body Weight',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE5ZsR',
      },
      effectiveDateTime: '2022-11-16T06:10:16Z',
      issued: '2022-11-16T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 86.1,
        unit: 'kg',
        system: 'http://unitsofmeasure.org',
        code: 'kg',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLnSIwmz',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLnSIwmz',
      meta: {
        lastUpdated: '2022-12-16T06:10:16Z',
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
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE5ZsR',
      },
      effectiveDateTime: '2022-11-16T06:10:16Z',
      issued: '2022-11-16T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
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
            value: 67,
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
            value: 103,
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
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLnSJDq1',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLnSJDq1',
      meta: {
        lastUpdated: '2022-12-16T06:10:16Z',
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
            code: '8867-4',
            display: 'Heart rate',
          },
        ],
        text: 'Heart rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE5ZsR',
      },
      effectiveDateTime: '2022-11-16T06:10:16Z',
      issued: '2022-11-16T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 61,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmLnUXXRF',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmLnUXXRF',
      meta: {
        lastUpdated: '2022-12-16T06:10:16Z',
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
            code: '9279-1',
            display: 'Respiratory rate',
          },
        ],
        text: 'Respiratory rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE5ZsR',
      },
      effectiveDateTime: '2022-11-16T06:10:16Z',
      issued: '2022-11-16T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 12,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmM61ZlyP',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmM61ZlyP',
      meta: {
        lastUpdated: '2023-02-17T06:10:16Z',
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
            code: '8302-2',
            display: 'Body Height',
          },
        ],
        text: 'Body Height',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE5qvT',
      },
      effectiveDateTime: '2023-01-18T06:10:16Z',
      issued: '2023-01-18T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 171.3,
        unit: 'cm',
        system: 'http://unitsofmeasure.org',
        code: 'cm',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmM61a31R',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmM61a31R',
      meta: {
        lastUpdated: '2023-02-17T06:10:16Z',
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
            code: '72514-3',
            display:
              'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
          },
        ],
        text: 'Pain severity - 0-10 verbal numeric rating [Score] - Reported',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE5qvT',
      },
      effectiveDateTime: '2023-01-18T06:10:16Z',
      issued: '2023-01-18T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 3,
        unit: 'Score',
        system: 'http://unitsofmeasure.org',
        code: '{score}',
      },
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
      referenceRange: [
        {
          low: {
            value: 20,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
          high: {
            value: 182,
            unit: 'Score',
            system: 'http://unitsofmeasure.org',
            code: '{score}',
          },
        },
      ],
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmM61aK4T',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmM61aK4T',
      meta: {
        lastUpdated: '2023-02-17T06:10:16Z',
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
            code: '29463-7',
            display: 'Body Weight',
          },
        ],
        text: 'Body Weight',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE5qvT',
      },
      effectiveDateTime: '2023-01-18T06:10:16Z',
      issued: '2023-01-18T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 86.5,
        unit: 'kg',
        system: 'http://unitsofmeasure.org',
        code: 'kg',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmM61asAX',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmM61asAX',
      meta: {
        lastUpdated: '2023-02-17T06:10:16Z',
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
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE5qvT',
      },
      effectiveDateTime: '2023-01-18T06:10:16Z',
      issued: '2023-01-18T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
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
            value: 71,
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
            value: 104,
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
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmM61b9DZ',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmM61b9DZ',
      meta: {
        lastUpdated: '2023-02-17T06:10:16Z',
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
            code: '8867-4',
            display: 'Heart rate',
          },
        ],
        text: 'Heart rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE5qvT',
      },
      effectiveDateTime: '2023-01-18T06:10:16Z',
      issued: '2023-01-18T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 91,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
  {
    fullUrl:
      'https://sandbox-api.va.gov/services/fhir/v0/r4/Observation/4-1bKlpYmM61bQGb',
    resource: {
      resourceType: 'Observation',
      id: '4-1bKlpYmM61bQGb',
      meta: {
        lastUpdated: '2023-02-17T06:10:16Z',
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
            code: '9279-1',
            display: 'Respiratory rate',
          },
        ],
        text: 'Respiratory rate',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZE5qvT',
      },
      effectiveDateTime: '2023-01-18T06:10:16Z',
      issued: '2023-01-18T06:10:16Z',
      performer: [
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgeCVCVl',
          display: 'Dr. Veronika907 Rogahn59',
        },
        {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/4-O3d8XKfncXMC',
          display: 'TEST VAMC',
        },
      ],
      valueQuantity: {
        value: 13,
        unit: '/min',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
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
    },
    search: {
      mode: 'match',
    },
  },
];

const oneInEveryMonth = [
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
            display: 'Blood Pressure - Januar',
          },
        ],
        text: 'Blood Pressure',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9W4SB',
      },
      effectiveDateTime: '2024-01-26T06:10:16Z',
      issued: '2013-01-26T06:10:16Z',
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
            value: 202401,
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
            display: 'Blood Pressure - Januar',
          },
        ],
        text: 'Blood Pressure',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9W4SB',
      },
      effectiveDateTime: '2024-01-06T06:10:16Z',
      issued: '2013-01-06T06:10:16Z',
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
            value: 202402,
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
            display: 'Blood Pressure - Januar',
          },
        ],
        text: 'Blood Pressure',
      },
      subject: {
        reference: 'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/49',
        display: 'Mrs. Therese102 Un745 Oberbrunner298',
      },
      encounter: {
        reference:
          'https://sandbox-api.va.gov/services/fhir/v0/r4/Encounter/4-1abONcOSZ9W4SB',
      },
      effectiveDateTime: '2024-02-26T06:10:16Z',
      issued: '2013-02-26T06:10:16Z',
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
            value: 2024023,
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
];

const all = (from, _to) => {
  const bucket = oneInEveryMonth;

  const matches = [];
  const [year, month] = from.split('-');
  const fromDate = new Date(year, month - 1, 1);
  const toDate = new Date(
    fromDate.getFullYear(),
    fromDate.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );

  for (const entry of bucket) {
    // include entry if effectiveDateTime is between from and to
    const entryDate = new Date(entry.resource.effectiveDateTime);
    // console.log({
    //   fromDate:fromDate.getTime(),
    //   entryDate:entryDate.getTime(),
    //   toDate:toDate.getTime(),
    //   afterFrom:entryDate.getTime() >= fromDate.getTime(),
    //   beforeTo:entryDate.getTime() <= toDate.getTime()
    // })
    if (
      entryDate.getTime() >= fromDate.getTime() &&
      entryDate.getTime() <= toDate.getTime()
    ) {
      // console.log('got match');
      matches.push(entry);
    }
  }

  return { entry: matches };
};

module.exports = {
  all,
};
