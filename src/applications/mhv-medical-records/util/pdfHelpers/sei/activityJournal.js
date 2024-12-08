export const generateActivityJournalContent = record => {
  const content = {
    title: record.date,
    details: [
      {
        items: [
          {
            title: 'Day of week',
            value: record.dayOfWeek,
            inline: true,
          },
          {
            title: 'Comments',
            value: record.dayOfWeek,
            inline: true,
          },
        ],
      },
    ],
  };

  const activities =
    record.activities?.map(item => ({
      header: item.activity,
      items: [
        {
          title: 'Type',
          value: item.type,
          inline: true,
        },
        {
          title: 'Measure',
          value: item.measure,
          inline: true,
        },
        {
          title: 'Intensity',
          value: item.intensity,
          inline: true,
        },
        {
          title: 'Number of sets',
          value: item.numberOfSets,
          inline: true,
        },
        {
          title: 'Number of reps',
          value: item.numberOfReps,
          inline: true,
        },
        {
          title: 'Time of day',
          value: item.timeOfDay,
          inline: true,
        },
      ],
    })) || [];

  content.details = [...content.details, ...activities];

  return content;
};
