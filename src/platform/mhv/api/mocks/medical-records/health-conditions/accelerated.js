const all = [
  {
    id: 'I2-2BCP5BAI6N7NQSAPSVIJ6INQ4A000000',
    attributes: {
      name: 'Discharge Summary',
      date: '2019-03-12T16:30:00Z',
      // TODO: To check with backend
      // attribute :provider
      // attribute :facility
      // attribute :comments
    },
  },
  {
    id: 'I2-2BCP5BAI6N7NQSAPSVIJ6INQ4A000000',
    attributes: {
      name: ' Consult Result',
      date: '2019-03-12T16:30:00Z',
      // TODO: To check with backend
      // attribute :provider
      // attribute :facility
      // attribute :comments
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
