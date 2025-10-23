export const generateVaccinesContent = record => {
  return {
    title: record.vaccine,
    details: [
      {
        items: [
          {
            title: 'Other',
            value: record.other,
            inline: true,
          },
          {
            title: 'Start date',
            value: record.dateReceived,
            inline: true,
          },
          {
            title: 'Method',
            value: record.method,
            inline: true,
          },
          {
            title: 'Reactions',
            value: record.reactions,
            inline: true,
          },
          {
            title: 'Comments',
            value: record.comments,
            inline: true,
          },
        ],
      },
    ],
  };
};
