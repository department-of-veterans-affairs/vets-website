const all = {
  data: [
    {
      id: '12341',
      type: 'condition',
      attributes: {
        date: '2022-04-29T14:20:00Z',
        name: 'Back pain (SCT53978)',
        provider: 'Gregory House',
        facility: 'Washington DC VA Medical Center',
        comments: '',
      },
    },
    {
      id: '12342',
      type: 'condition',
      attributes: {
        date: '2022-03-08T14:20:00Z',
        name: 'Sick sinus syndrome',
        provider: 'Gregory Jacobs',
        facility: 'Washington DC VA Medical Center',
        comments: ['Consistent Tachycardia-Brachycardia'],
      },
    },
    {
      id: '12343',
      type: 'condition',
      attributes: {
        date: '2022-01-11T14:20:00Z',
        name: 'Asthma',
        provider: "Jackson O'Shea",
        facility: 'Washington DC VA Medical Center',
        comments: [
          'Spirometry, PEF, below standard, chest CT shows airway thickening',
        ],
      },
    },
    {
      id: '12344',
      type: 'condition',
      attributes: {
        date: '2021-12-09T14:20:00Z',
        name: 'Hypertension (SCT48073)',
        provider: 'M.D. Christina Yang',
        facility: 'Washington DC VA Medical Center',
        comments: ['BP ranging from 150/90 to 170/110'],
      },
    },
    {
      id: '12345',
      type: 'condition',
      attributes: {
        date: '2020-09-17T14:20:00Z',
        name: 'Anemia (ICD102894)',
        provider: 'M.D. Tracy Marrow',
        facility: 'Washington DC VA Medical Center',
        comments: ['Hemoglobin baseline <10'],
      },
    },
    {
      id: '12346',
      type: 'condition',
      attributes: {
        date: '2018-06-05T14:20:00Z',
        name: 'Inflammation',
        provider: 'M.D. Tracy Marrow',
        facility: 'Washington DC VA Medical Center',
        comments: ['Counseled patient on DASH diet'],
      },
    },
  ],
};
const empty = [];
const single = id => {
  const sampleData = all.find(item => item.id === id);
  if (!sampleData) {
    return null;
  }
  return {
    data: sampleData,
  };
};

module.exports = {
  all,
  empty,
  single,
};
