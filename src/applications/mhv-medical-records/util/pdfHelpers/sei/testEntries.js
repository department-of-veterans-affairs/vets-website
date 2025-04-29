export const generateTestEntriesContent = record => {
  return {
    title: record.testName,
    details: [
      {
        items: [
          {
            title: 'Date',
            value: record.date,
            inline: true,
          },
          {
            title: 'Location performed',
            value: record.locationPerformed,
            inline: true,
          },
          {
            title: 'Provider',
            value: record.provider,
            inline: true,
          },
          {
            title: 'Results',
            value: record.results,
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
