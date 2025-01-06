export const generateMedicalEventsContent = record => {
  return {
    title: record.medicalEvent,
    details: [
      {
        items: [
          {
            title: 'Start date',
            value: record.startDate,
            inline: true,
          },
          {
            title: 'Stop date',
            value: record.stopDate,
            inline: true,
          },
          {
            title: 'Response',
            value: record.response,
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
