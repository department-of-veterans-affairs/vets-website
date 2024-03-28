export const generateConditionContent = record => ({
  details: {
    items: [
      {
        title: 'Date',
        value: record.date,
        inline: true,
      },
      {
        title: 'Provider',
        value: record.provider,
        inline: true,
      },
      {
        title: 'Provider Notes',
        value: record.note,
        inline: !record.comments.length,
      },
      {
        title: 'Status of health condition',
        value: record.active,
        inline: true,
      },
      {
        title: 'Location',
        value: record.facility,
        inline: true,
      },
      {
        title: 'SNOMED Clinical term',
        value: record.name,
        inline: true,
      },
    ],
  },
});
