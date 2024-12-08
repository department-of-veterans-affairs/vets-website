export const generateMedicalEventsContent = record => {
  return {
    title: record.asdf,
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
    ],
  };
};
