export const generateConditionContent = record => ({
  details: {
    items: [
      {
        title: 'Entered on',
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
        title: 'Provider Notes',
        value: record.comments,
        inline: !record.comments.length,
      },
    ],
  },
});
