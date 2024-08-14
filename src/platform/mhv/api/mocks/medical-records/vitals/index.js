const all = {
  entry: [
    {
      fullUrl: 'http://localhost:8081/fhir/Observation/38852',
      resource: {
        code: {
          coding: [
            {
              code: '85354-9',
              display: 'Blood pressure panel with all children optional',
              system: 'http://loinc.org',
            },
            {
              code: '4500634',
              display: 'BLOOD PRESSURE',
              system: 'urn:oid:2.16.840.1.113883.6.233',
            },
          ],
          text: 'BLOOD PRESSURE',
        },
        component: [
          {
            code: {
              coding: [
                {
                  code: '8480-6',
                  display: 'Systolic blood pressure',
                  system: 'http://loinc.org',
                },
              ],
            },
            valueQuantity: {
              code: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              unit: 'mm[Hg]',
              value: 130,
            },
          },
          {
            code: {
              coding: [
                {
                  code: '8462-4',
                  display: 'Diastolic blood pressure',
                  system: 'http://loinc.org',
                },
              ],
            },
            valueQuantity: {
              code: 'mm[Hg]',
              system: 'http://unitsofmeasure.org',
              unit: 'mm[Hg]',
              value: 70,
            },
          },
        ],
        contained: [
          {
            id: 'Location-0',
            identifier: [
              {
                system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
                use: 'usual',
                value: 'HospitalLocationTO.3669',
              },
            ],
            meta: {
              profile: [
                'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/VA.MHV.PHR.location',
              ],
            },
            name: 'ADTP BURNETT',
            resourceType: 'Location',
          },
        ],
        effectiveDateTime: '2023-10-27T10:00:00-04:00',
        id: '38852',
        identifier: [
          {
            system: 'urn:oid:2.16.840.1.113883.4.349.4.984',
            use: 'usual',
            value: 'VitalSignTO.6544837',
          },
        ],
        performer: [
          {
            display: 'ADTP BURNETT',
            extension: [
              {
                url:
                  'http://hl7.org/fhir/StructureDefinition/alternate-reference',
                valueReference: {
                  reference: '#Location-0',
                },
              },
            ],
          },
        ],
        resourceType: 'Observation',
        status: 'final',
        subject: {
          reference: 'Patient/33702',
        },
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
