const all = [
  {
    attributes: {
      id: 'I3-3BCP5BAI6N7NQSAPSVIJ6INQ4A000003',
      date: '2025-01-15T10:30:00Z',
      name: 'Essential hypertension',
      provider: 'Dr. Smith, John',
      facility: 'VA Medical Center',
      comments: 'Blood pressure well controlled.',
    },
  },
  {
    attributes: {
      id: 'I2-2BCP5BAI6N7NQSAPSVIJ6INQ4A000000',
      date: '2024-12-01T14:20:00Z',
      name: 'Type 2 diabetes mellitus',
      provider: 'SILVA, MARIA GONZALEZ',
      facility: 'Oracle Health Medical Center',
      comments: 'Diabetes management ongoing.',
    },
  },
];
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
