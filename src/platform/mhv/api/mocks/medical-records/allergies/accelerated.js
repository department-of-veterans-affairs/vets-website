const all = {
  data: [
    {
      id: '132892323',
      type: 'allergy',
      attributes: {
        id: '132892323',
        name: 'penicillins',
        categories: ['medication'],
        date: '2025-02-25T17:50:49Z',
        reactions: ['Urticaria (Hives)', 'Sneezing'],
        location: 'VA Medical Center',
        // observedHistoric: null, // Not available in Oracle Health FHIR data
        notes: [
          'Patient reports adverse reaction to previously prescribed pencicillins',
        ],
        provider: 'Borland, Victoria A',
      },
    },
    {
      id: '132892324',
      type: 'allergy',
      attributes: {
        id: '132892324',
        name: 'Shellfish',
        categories: ['food'],
        date: '2024-08-15T10:30:00Z',
        reactions: ['Difficulty breathing', 'Rash'],
        location: 'Community Care Center',
        // observedHistoric: null, // Not available in Oracle Health FHIR data
        notes: ['Patient reports severe reaction to shellfish'],
        provider: 'Dr. Sarah Johnson',
      },
    },
    {
      id: '132892325',
      type: 'allergy',
      attributes: {
        id: '132892325',
        name: 'Peanuts',
        categories: ['food'],
        date: '2023-12-10T14:20:00Z',
        reactions: ['Anaphylaxis', 'Swelling'],
        location: 'VA Medical Center',
        // observedHistoric: null, // Not available in Oracle Health FHIR data
        notes: ['Severe allergic reaction requiring epinephrine'],
        provider: 'Dr. Michael Smith',
      },
    },
    {
      id: '30624',
      type: 'allergy',
      attributes: {
        id: '30624',
        name: 'NKA (NO KNOWN ALLERGY)',
        categories: ['medication'],
        date: '1994-10-05T15:54:34+00:00',
        reactions: [],
        location: 'VA Medical Center',
        observedHistoric: 'h', // VistA data example - has this field
        notes: ['PER PAN 10-5-94'],
        provider: 'VA Medical Center',
      },
    },
  ],
};

const empty = { data: [] };

const single = (req, res) => {
  const { id } = req.params;
  const response = all.data.find(item => item.id === id);
  return res.json({ data: response });
};

module.exports = {
  all,
  single,
  empty,
};
