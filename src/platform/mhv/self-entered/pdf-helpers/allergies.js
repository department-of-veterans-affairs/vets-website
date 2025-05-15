export const generateAllergiesContent = record => {
  return {
    title: record.allergyName,
    details: [
      {
        items: [
          {
            title: 'Date',
            value: record.date,
            inline: true,
          },
          {
            title: 'Severity',
            value: record.severity,
            inline: true,
          },
          {
            title: 'Diagnosed',
            value: record.diagnosed,
            inline: true,
          },
          {
            title: 'Reaction',
            value: record.reaction,
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
