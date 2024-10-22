const oracleHealthSample = {
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
        text: 'cefdinir',
      },
    ],
  },
  search: {
    mode: 'match',
  },
};

const vistaHealthSample = {
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
};

const all = {
  resourceType: 'Bundle',
  id: '12121',
  meta: {
    lastUpdated: '2023-09-29T11:04:31.316-04:00',
  },
  type: 'searchset',
  entry: [oracleHealthSample, vistaHealthSample],
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
