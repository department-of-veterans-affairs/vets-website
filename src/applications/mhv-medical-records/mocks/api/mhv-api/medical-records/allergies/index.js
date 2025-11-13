const all = {
  resourceType: 'Bundle',
  id: '12121',
  meta: {
    lastUpdated: '2023-09-29T11:04:31.316-04:00',
  },
  type: 'searchset',
  entry: [
    {
      resource: {
        resourceType: 'AllergyIntolerance',
        id: '12341',
        contained: [
          {
            resourceType: 'Organization',
            id: 'Organization-0',
            name: 'Washington DC VAMC',
          },
        ],
        category: ['medication'],
        code: {
          text: 'Bee Pollen',
        },
        recordedDate: '2024-01-12T11:13:00-06:00',
        recorder: {
          extension: [
            {
              valueReference: {
                reference: '#Organization-0',
              },
            },
          ],
          display: 'Washington DC VAMC',
        },
        extension: [
          {
            url:
              'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/allergyObservedHistoric',
            valueCode: 'h',
          },
        ],
        note: [
          {
            text:
              'Patient reports having this allergy since childhood. They carry an epi-pen.',
          },
        ],
        reaction: [
          {
            manifestation: [
              {
                text: 'SWELLING',
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        resourceType: 'AllergyIntolerance',
        id: '12342',
        contained: [
          {
            resourceType: 'Organization',
            id: 'Organization-0',
            name: 'Washington DC VAMC',
          },
        ],
        category: ['food'],
        code: {
          text: 'Nuts',
        },
        recordedDate: '2024-01-12T11:12:00-06:00',
        recorder: {
          extension: [
            {
              valueReference: {
                reference: '#Organization-0',
              },
            },
          ],
          display: 'Washington DC VAMC',
        },
        extension: [
          {
            url:
              'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/allergyObservedHistoric',
            valueCode: 'h',
          },
        ],
        note: [
          {
            text:
              'Patient reported severe reaction to tree nuts. Carries an epi-pen.',
          },
        ],
        reaction: [
          {
            manifestation: [
              {
                text: 'SWELLING',
              },
              {
                text: 'RESPIRATORY DISTRESS',
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        resourceType: 'AllergyIntolerance',
        id: '12343',
        contained: [
          {
            resourceType: 'Organization',
            id: 'Organization-0',
            name: 'Washington DC VAMC',
          },
        ],
        category: ['medication'],
        code: {
          text: 'Sunflower Oil',
        },
        recordedDate: '2024-01-12T11:11:00-06:00',
        recorder: {
          extension: [
            {
              valueReference: {
                reference: '#Organization-0',
              },
            },
          ],
          display: 'Washington DC VAMC',
        },
        extension: [
          {
            url:
              'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/allergyObservedHistoric',
            valueCode: 'o',
          },
        ],
        note: [
          {
            text: 'Patient reported.',
          },
        ],
        reaction: [
          {
            manifestation: [
              {
                text: 'RESPIRATORY DISTRESS',
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        resourceType: 'AllergyIntolerance',
        id: '12344',
        contained: [
          {
            resourceType: 'Organization',
            id: 'Organization-0',
            name: 'Washington DC VAMC',
          },
        ],
        category: ['drug allergy'],
        code: {
          text: 'Penicillin',
        },
        recordedDate: '2022-04-29T11:14:00-06:00',
        recorder: {
          extension: [
            {
              valueReference: {
                reference: '#Organization-0',
              },
            },
          ],
          display: 'Washington DC VAMC',
        },
        extension: [
          {
            url:
              'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/allergyObservedHistoric',
            valueCode: 'o',
          },
        ],
        note: [
          {
            text: 'Patient is to have no cillin or cef/ceph antibiotics',
          },
        ],
        reaction: [
          {
            manifestation: [
              {
                text: 'Anaphylaxis',
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        resourceType: 'AllergyIntolerance',
        id: '12345',
        contained: [
          {
            resourceType: 'Organization',
            id: 'Organization-0',
            name: 'Washington DC VAMC',
          },
        ],
        category: ['medication'],
        code: {
          text: 'Skin Prep',
        },
        recordedDate: '2018-06-15T11:14:00-06:00',
        recorder: {
          extension: [
            {
              valueReference: {
                reference: '#Organization-0',
              },
            },
          ],
          display: 'Washington DC VAMC',
        },
        extension: [
          {
            url:
              'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/allergyObservedHistoric',
            valueCode: 'o',
          },
        ],
        note: [
          {
            text: 'Reaction on left arm while prepping for blood draw.',
          },
        ],
        reaction: [
          {
            manifestation: [
              {
                text: 'SWELLING',
              },
            ],
          },
        ],
      },
    },
    {
      resource: {
        resourceType: 'AllergyIntolerance',
        id: '12346',
        contained: [
          {
            resourceType: 'Organization',
            id: 'Organization-0',
            name: 'Washington DC VAMC',
          },
        ],
        category: ['medication'],
        code: {
          text: 'Aspirin',
        },
        recordedDate: '2001-11-01T11:14:00-06:00',
        recorder: {
          extension: [
            {
              valueReference: {
                reference: '#Organization-0',
              },
            },
          ],
          display: 'Washington DC VAMC',
        },
        extension: [
          {
            url:
              'https://department-of-veterans-affairs.github.io/mhv-fhir-phr-mapping/StructureDefinition/allergyObservedHistoric',
            valueCode: 'o',
          },
        ],
        note: [
          {
            text:
              'Patient experienced a rash on their neck and chest. Benadryl was administered. Patient advised to avoid aspirin.',
          },
        ],
        reaction: [
          {
            manifestation: [
              {
                text: 'URTICARIA',
              },
            ],
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
  return res.json(response ? response.resource : {});
};

module.exports = {
  all,
  single,
};
