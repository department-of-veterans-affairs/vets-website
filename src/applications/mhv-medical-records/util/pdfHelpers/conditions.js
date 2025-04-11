export const generateConditionContent = record => ({
  details: {
    items: [
      {
        title: 'Date entered',
        value: record.date,
        inline: true,
      },
      {
        title: 'Provider',
        value: record.provider,
        inline: true,
      },
      {
        title: 'Location',
        value: record.facility,
        inline: true,
      },
      {
        title: 'Provider notes',
        value: record.comments,
        inline: true,
      },
    ],
  },
});
