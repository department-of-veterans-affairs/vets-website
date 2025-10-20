const all = {
  data: [
    {
      id: '2678',
      type: 'allergy',
      attributes: {
        id: '2678',
        name: 'TRAZODONE',
        date: null,
        categories: ['medication'],
        reactions: [],
        location: null,
        observedHistoric: 'h',
        notes: [],
        provider: null,
      },
    },
    {
      id: '30624',
      type: 'allergy',
      attributes: {
        id: '30624',
        name: 'NKA (NO KNOWN ALLERGY)',
        date: null,
        categories: ['medication'],
        reactions: [],
        location: null,
        observedHistoric: 'h',
        notes: ['PER PAN 10-5-94'],
        provider: null,
      },
    },
    {
      id: '2679',
      type: 'allergy',
      attributes: {
        id: '2679',
        name: 'MAXZIDE',
        date: null,
        categories: ['medication'],
        reactions: [],
        location: null,
        observedHistoric: 'h',
        notes: [],
        provider: null,
      },
    },
    {
      id: '2677',
      type: 'allergy',
      attributes: {
        id: '2677',
        name: 'INDOMETHACIN',
        date: null,
        categories: ['medication'],
        reactions: [],
        location: null,
        observedHistoric: 'h',
        notes: [],
        provider: null,
      },
    },
    {
      id: '2676',
      type: 'allergy',
      attributes: {
        id: '2676',
        name: 'ASPIRIN',
        date: null,
        categories: ['medication'],
        reactions: [],
        location: null,
        observedHistoric: 'h',
        notes: [],
        provider: null,
      },
    },
    {
      id: '132892323',
      type: 'allergy',
      attributes: {
        id: '132892323',
        name: 'Penicillin',
        date: '2002',
        categories: ['medication'],
        reactions: ['Urticaria (Hives)', 'Sneezing'],
        location: null,
        observedHistoric: null,
        notes: [
          'Patient reports adverse reaction to previously prescribed pencicillins',
        ],
        provider: ' Victoria A Borland',
      },
    },
    {
      id: '132316417',
      type: 'allergy',
      attributes: {
        id: '132316417',
        name: 'Oxymorphone',
        date: '2019',
        categories: ['medication'],
        reactions: ['Anaphylaxis'],
        location: null,
        observedHistoric: null,
        notes: [
          'Testing Contraindication type reaction',
          'Secondary comment for contraindication',
        ],
        provider: ' Victoria A Borland',
      },
    },
    {
      id: '132320329',
      type: 'allergy',
      attributes: {
        id: '132320329',
        name: 'Naproxen',
        date: '2004-12-17',
        categories: ['medication'],
        reactions: ['Sneezing', 'Syncope', 'free text reaction'],
        location: null,
        observedHistoric: null,
        notes: [
          'This is a secondary comment added to the naproxen allergy',
          'This is an initial comment added to the naproxen allergy',
        ],
        provider: ' Victoria A Borland',
      },
    },
    {
      id: '132312405',
      type: 'allergy',
      attributes: {
        id: '132312405',
        name: 'Grass pollen (substance)',
        date: '2022',
        categories: ['environment'],
        reactions: ['Sneezing', 'Urticaria (Hives)'],
        location: null,
        observedHistoric: null,
        notes: [
          'Testing whether alllergy with resolved status is still passed through !@\\#$%^&*()',
        ],
        provider: ' Victoria A Borland',
      },
    },
    {
      id: '132320343',
      type: 'allergy',
      attributes: {
        id: '132320343',
        name: 'Radish (substance)',
        date: '1966',
        categories: ['food'],
        reactions: ['Depression'],
        location: null,
        observedHistoric: null,
        notes: ['Radish makes Hooper sad-ish :('],
        provider: ' Victoria A Borland',
      },
    },
    {
      id: '132316411',
      type: 'allergy',
      attributes: {
        id: '132316411',
        name: 'Sunlight (substance) (deprecated)',
        date: '2024',
        categories: [],
        reactions: ['Urticaria (Hives)'],
        location: null,
        observedHistoric: null,
        notes: [],
        provider: ' Victoria A Borland',
      },
    },
    {
      id: '132312395',
      type: 'allergy',
      attributes: {
        id: '132312395',
        name: 'Coconut (substance)',
        date: '2024-11-08',
        categories: ['food'],
        reactions: ['Pruritus', 'Delirium'],
        location: null,
        observedHistoric: null,
        notes: ['This allergy duplicates an allergy entered into VistA'],
        provider: ' Victoria A Borland',
      },
    },
    {
      id: '132316427',
      type: 'allergy',
      attributes: {
        id: '132316427',
        name: 'Cashew nut (substance)',
        date: '2024-12-17',
        categories: ['food'],
        reactions: ['Oral Edema'],
        location: null,
        observedHistoric: null,
        notes: [],
        provider: ' Victoria A Borland',
      },
    },
  ],
};

const empty = { data: [] };

const single = (req, res) => {
  const { id } = req.params;
  const response = all.data.find(item => {
    return item.id === id;
  });
  return res.json(response || {});
};

module.exports = {
  all,
  single,
  empty,
};
