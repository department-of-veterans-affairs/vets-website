export const generateActivityJournalContent = record => {
  return {
    details: [
      {
        items: [
          {
            title: 'asdf',
            value: record.asdf,
            inline: true,
          },
        ],
      },
      {
        header: 'asdf',
        items: [
          {
            title: 'asdf',
            value: record.asdf,
            inline: true,
          },
        ],
      },
    ],
  };
};
