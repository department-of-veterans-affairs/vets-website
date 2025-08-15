const all = {
  resourceType: 'Bundle',
  id: '27b154d8-18c6-41b3-a988-8474bacd19a8',
  meta: {
    lastUpdated: '2023-09-29T11:04:31.316-04:00',
  },
  type: 'searchset',
  link: [
    {
      relation: 'self',
      url:
        'https://mhv-sysb-api.myhealth.va.gov/fhir/AllergyIntolerance?_count=5&patient=3102',
    },
    {
      relation: 'next',
      url:
        'https://mhv-sysb-api.myhealth.va.gov/fhir?_getpages=27b154d8-18c6-41b3-a988-8474bacd19a8&_getpagesoffset=5&_count=5&_pretty=true&_bundletype=searchset',
    },
  ],
  entry: [
    {
      resource: {
        resourceType: 'Condition',
        id: '12341',
        contained: [
          {
            resourceType: 'Practitioner',
            id: 'ex-MHV-practitioner-36556',
            name: [
              {
                text: 'Gregory House, M.D.',
                family: 'House',
                given: ['Gregory'],
              },
            ],
          },
          {
            resourceType: 'Location',
            id: 'ex-MHV-location-552',
            name: 'Washington DC VA Medical Center',
          },
        ],
        code: {
          text: 'Back pain (SCT53978)',
        },
        recordedDate: '2022-04-29',
        recorder: {
          extension: [
            {
              url:
                'http://hl7.org/fhir/StructureDefinition/alternate-reference',
              valueReference: { reference: '#ex-MHV-location-552' },
            },
          ],
          reference: '#ex-MHV-practitioner-36556',
        },
        // note: [
        //   {
        //     text: 'foo',
        //   },
        // ],
      },
    },
    {
      resource: {
        resourceType: 'Condition',
        id: '12342',
        contained: [
          {
            resourceType: 'Practitioner',
            id: 'ex-MHV-practitioner-36556',
            name: [
              {
                text: 'Gregory Jacobs, M.D.',
                family: 'Jacobs',
                given: ['Gregory'],
              },
            ],
          },
          {
            resourceType: 'Location',
            id: 'ex-MHV-location-552',
            name: 'Washington DC VA Medical Center',
          },
        ],
        code: {
          text: 'Sick sinus syndrome',
        },
        recordedDate: '2022-03-08',
        recorder: {
          extension: [
            {
              url:
                'http://hl7.org/fhir/StructureDefinition/alternate-reference',
              valueReference: { reference: '#ex-MHV-location-552' },
            },
          ],
          reference: '#ex-MHV-practitioner-36556',
        },
        note: [
          {
            text: 'Consistent Tachycardia-Brachycardia',
          },
        ],
      },
    },
    {
      resource: {
        resourceType: 'Condition',
        id: '12343',
        contained: [
          {
            resourceType: 'Practitioner',
            id: 'ex-MHV-practitioner-36556',
            name: [
              {
                text: "O'Shea Jackson, D.O.",
                family: "O'Shea",
                given: ['Jackson'],
              },
            ],
          },
          {
            resourceType: 'Location',
            id: 'ex-MHV-location-552',
            name: 'Washington DC VA Medical Center',
          },
        ],
        code: {
          text: 'Asthma',
        },
        recordedDate: '2022-01-11',
        recorder: {
          extension: [
            {
              url:
                'http://hl7.org/fhir/StructureDefinition/alternate-reference',
              valueReference: { reference: '#ex-MHV-location-552' },
            },
          ],
          reference: '#ex-MHV-practitioner-36556',
        },
        note: [
          {
            text:
              'Spirometry, PEF, below standard, chest CT shows airway thickening',
          },
        ],
      },
    },
    {
      resource: {
        resourceType: 'Condition',
        id: '12344',
        contained: [
          {
            resourceType: 'Practitioner',
            id: 'ex-MHV-practitioner-36556',
            name: [
              {
                text: 'Christina Yang, M.D.',
              },
            ],
          },
          {
            resourceType: 'Location',
            id: 'ex-MHV-location-552',
            name: 'Washington DC VA Medical Center',
          },
        ],
        code: {
          text: 'Hypertension (SCT48073)',
        },
        recordedDate: '2021-12-09',
        recorder: {
          extension: [
            {
              url:
                'http://hl7.org/fhir/StructureDefinition/alternate-reference',
              valueReference: { reference: '#ex-MHV-location-552' },
            },
          ],
          reference: '#ex-MHV-practitioner-36556',
        },
        note: [
          {
            text: 'BP ranging from 150/90 to 170/110',
          },
        ],
      },
    },
    {
      resource: {
        resourceType: 'Condition',
        id: '12345',
        contained: [
          {
            resourceType: 'Practitioner',
            id: 'ex-MHV-practitioner-36556',
            name: [
              {
                text: 'Tracy Marrow, M.D.',
              },
            ],
          },
          {
            resourceType: 'Location',
            id: 'ex-MHV-location-552',
            name: 'Washington DC VA Medical Center',
          },
        ],
        code: {
          text: 'Anemia (ICD102894)',
        },
        recordedDate: '2020-09-17',
        recorder: {
          extension: [
            {
              url:
                'http://hl7.org/fhir/StructureDefinition/alternate-reference',
              valueReference: { reference: '#ex-MHV-location-552' },
            },
          ],
          reference: '#ex-MHV-practitioner-36556',
        },
        note: [
          {
            text: 'Hemoglobin baseline <10',
          },
        ],
      },
    },
    {
      resource: {
        resourceType: 'Condition',
        id: '12346',
        contained: [
          {
            resourceType: 'Practitioner',
            id: 'ex-MHV-practitioner-36556',
            name: [
              {
                text: 'Tracy Marrow, M.D.',
              },
            ],
          },
          {
            resourceType: 'Location',
            id: 'ex-MHV-location-552',
            name: 'Washington DC VA Medical Center',
          },
        ],
        code: {
          text: 'Inflammation',
        },
        recordedDate: '2018-06-05',
        recorder: {
          extension: [
            {
              url:
                'http://hl7.org/fhir/StructureDefinition/alternate-reference',
              valueReference: { reference: '#ex-MHV-location-552' },
            },
          ],
          reference: '#ex-MHV-practitioner-36556',
        },
        note: [
          {
            text: 'Counseled patient on DASH diet',
          },
        ],
      },
    },
  ],
};

const single = (req, res) => {
  const { id } = req.params;
  const response = all.entry.find(item => {
    return +item.resource.id === +id;
  });
  return res.json(response.resource);
};

module.exports = {
  all,
  single,
};
