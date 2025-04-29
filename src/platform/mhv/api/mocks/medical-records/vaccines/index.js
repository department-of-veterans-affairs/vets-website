const all = {
  id: '868a0f70-f920-4483-9be4-fa64f65d2e85',
  meta: {
    lastUpdated: '2023-07-21T12:22:25.721-04:00',
  },
  entry: [
    {
      resource: {
        resourceType: 'Immunization',
        id: '12341',
        contained: [
          {
            resourceType: 'Location',
            id: 'in-location-2',
            name: 'Washington DC VAMC',
          },
          {
            resourceType: 'Observation',
            id: 'in-reaction-2',
            code: {
              text: 'FEVER',
            },
          },
        ],
        vaccineCode: {
          text: 'INFLUENZA, HIGH-DOSE, QUADRIVALENT',
        },
        occurrenceDateTime: '2024-03-12T16:56:38Z',
        location: {
          reference: '#in-location-2',
        },
        note: [
          {
            text: '',
          },
        ],
        reaction: [
          {
            detail: {
              reference: '#in-reaction-2',
            },
          },
        ],
      },
    },
    {
      resource: {
        resourceType: 'Immunization',
        id: '12342',
        contained: [
          {
            resourceType: 'Location',
            id: 'in-location-2',
            name: 'Washington DC VAMC',
          },
          {
            resourceType: 'Observation',
            id: 'in-reaction-2',
            code: {
              text: 'FEVER',
            },
          },
        ],
        vaccineCode: {
          text: 'INFLUENZA, HIGH-DOSE, QUADRIVALENT, PF',
        },
        occurrenceDateTime: '2023-12-08T16:56:38Z',
        location: {
          reference: '#in-location-2',
        },
        note: [
          {
            text: '',
          },
        ],
        reaction: [
          {
            detail: {
              reference: '#in-reaction-2',
            },
          },
        ],
      },
    },
    {
      resource: {
        resourceType: 'Immunization',
        id: '12343',
        contained: [
          {
            resourceType: 'Location',
            id: 'in-location-2',
            name: 'Washington DC VAMC',
          },
          {
            resourceType: 'Observation',
            id: 'in-reaction-2',
            code: {
              text: 'FEVER',
            },
          },
        ],
        vaccineCode: {
          text: 'INFLUENZA, HIGH-DOSE, QUADRIVALENT',
        },
        occurrenceDateTime: '2022-09-17T16:56:38Z',
        location: {
          reference: '#in-location-2',
        },
        note: [
          {
            text: '',
          },
        ],
        reaction: [
          {
            detail: {
              reference: '#in-reaction-2',
            },
          },
        ],
      },
    },
    {
      resource: {
        resourceType: 'Immunization',
        id: '12344',
        contained: [
          {
            resourceType: 'Location',
            id: 'in-location-2',
            name: 'Washington DC VAMC',
          },
          {
            resourceType: 'Observation',
            id: 'in-reaction-2',
            code: {
              text: 'FEVER',
            },
          },
        ],
        vaccineCode: {
          text: 'TDAP',
        },
        occurrenceDateTime: '2021-10-14T16:59:38Z',
        location: {
          reference: '#in-location-2',
        },
        note: [
          {
            text: '',
          },
        ],
        reaction: [
          {
            detail: {
              reference: '#in-reaction-2',
            },
          },
        ],
      },
    },
    {
      resource: {
        resourceType: 'Immunization',
        id: '12345',
        contained: [
          {
            resourceType: 'Location',
            id: 'in-location-2',
            name: 'Washington DC VAMC',
          },
          {
            resourceType: 'Observation',
            id: 'in-reaction-2',
            code: {
              text: 'FEVER',
            },
          },
        ],
        vaccineCode: {
          text: 'ZOSTER RECOMBINANT',
        },
        occurrenceDateTime: '2021-10-14T16:56:38Z',
        location: {
          reference: '#in-location-2',
        },
        note: [
          {
            text: '',
          },
        ],
        reaction: [
          {
            detail: {
              reference: '#in-reaction-2',
            },
          },
        ],
      },
    },
    {
      resource: {
        resourceType: 'Immunization',
        id: '12346',
        contained: [
          {
            resourceType: 'Location',
            id: 'in-location-2',
            name: 'Washington DC VAMC',
          },
          {
            resourceType: 'Observation',
            id: 'in-reaction-2',
            code: {
              text: 'FEVER',
            },
          },
        ],
        vaccineCode: {
          text: 'INFLUENZA, HIGH-DOSE, QUADRIVALENT, PF',
        },
        occurrenceDateTime: '2020-09-17T16:56:38Z',
        location: {
          reference: '#in-location-2',
        },
        note: [
          {
            text: '',
          },
        ],
        reaction: [
          {
            detail: {
              reference: '#in-reaction-2',
            },
          },
        ],
      },
    },
  ],
  resourceType: 'Bundle',
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
