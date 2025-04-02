const all = {
  resourceType: 'Bundle',
  type: 'searchset',
  link: [
    {
      relation: 'self',
      url:
        'https://sandbox-api.va.gov/services/fhir/v0/r4/AllergyIntolerance?patient=23000219&-pageToken=1~6Z807QTZrKsurkk',
    },
  ],
  entry: [
    {
      fullUrl:
        'https://sandbox-api.va.gov/services/fhir/v0/r4/AllergyIntolerance/4-6Z8D6dAzA9QPmy8',
      resource: {
        resourceType: 'AllergyIntolerance',
        id: '4-6Z8D6dAzA9QPmy8',
        meta: {
          lastUpdated: '2022-11-25T00:00:00Z',
        },
        clinicalStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
              code: 'active',
            },
          ],
        },
        verificationStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification',
              code: 'confirmed',
            },
          ],
        },
        type: 'allergy',
        category: ['medication'],
        code: {
          coding: [
            {
              system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
              code: '25037',
              display: 'cefdinir',
            },
          ],
          text: 'cefdinir',
        },
        patient: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/23000219',
          display: 'Mr. Dexter530 Victor265 Schneider199',
        },
        recordedDate: '1967-05-28T12:24:29Z',
        recorder: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgdpowOn',
          display: 'Dr. Regina408 Dietrich576',
        },
        note: [
          {
            authorReference: {
              reference:
                'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79MgdpowOn',
              display: 'Dr. Regina408 Dietrich576',
            },
            time: '1967-05-28T12:24:29Z',
            text: 'these are my notes about the cefdinir allergy',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://sandbox-api.va.gov/services/fhir/v0/r4/AllergyIntolerance/4-6Z8D6dAzABlkPZA',
      resource: {
        resourceType: 'AllergyIntolerance',
        id: '4-6Z8D6dAzABlkPZA',
        meta: {
          lastUpdated: '2022-11-25T00:00:00Z',
        },
        clinicalStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
              code: 'active',
            },
          ],
        },
        verificationStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification',
              code: 'confirmed',
            },
          ],
        },
        type: 'allergy',
        category: ['food'],
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '44027008',
              display: 'Seafood (substance)',
            },
          ],
          text: 'Seafood (substance)',
        },
        patient: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/23000219',
          display: 'Mr. Dexter530 Victor265 Schneider199',
        },
        recordedDate: '1967-05-28T12:24:29Z',
        recorder: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79Mgdyt0Mj',
          display: 'Dr. Marietta439 Schmeler639 MD',
        },
        note: [
          {
            authorReference: {
              reference:
                'https://sandbox-api.va.gov/services/fhir/v0/r4/Practitioner/4-Nn79Mgdyt0Mj',
              display: 'Dr. Marietta439 Schmeler639 MD',
            },
            time: '1967-05-28T12:24:29Z',
            text: 'Seafood (substance)',
          },
        ],
        reaction: [
          {
            substance: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '44027008',
                  display: 'Seafood (substance)',
                },
              ],
              text: 'Seafood (substance)',
            },
            manifestation: [
              {
                coding: [
                  {
                    system: 'urn:oid:2.16.840.1.113883.6.233',
                    code: '4637470',
                    display: 'DYSPNEA',
                  },
                ],
                text: 'DYSPNEA',
              },
              {
                coding: [
                  {
                    system: 'urn:oid:2.16.840.1.113883.6.233',
                    code: '4538635',
                    display: 'RASH',
                  },
                ],
                text: 'RASH',
              },
            ],
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

const single = (req, res) => {
  const { id } = req.params;
  const response = all.entry.find(item => {
    return item.resource.id === id;
  });
  return res.json(response ? response.resource : {});
};

module.exports = {
  all,
  single,
};
