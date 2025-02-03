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
      {
        title: 'About the code in this condition name',
        value:
          'Some of your health conditions may have diagnosis codes in the name that start with SCT or ICD. Providers use these codes to track your health conditions and to communicate with other providers about your care. If you have a question about these codes or a health condition, ask your provider at your next appointment.',
        inline: false,
      },
    ],
  },
});
