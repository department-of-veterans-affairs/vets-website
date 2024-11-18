const generateCCD = (req, res) => {
  const randomSeed = Math.floor(Math.random() * 1);

  return res.json([
    {
      dateGenerated: '2024-10-31T10:28:05.000-0400',
      status: randomSeed > 0 ? 'COMPLETE' : 'IN_PROCESS',
      patientId: '1012740024V936776',
    },
    {
      dateGenerated: '2024-10-30T10:00:40.000-0400',
      status: 'COMPLETE',
      patientId: '1012740024V936776',
    },
  ]);
};

module.exports = {
  generateCCD,
};
