export const generateMilitaryHistoryContent = record => {
  return {
    title: record.eventTitle,
    details: [
      {
        items: [
          {
            title: 'Event date',
            value: record.eventDate,
            inline: true,
          },
          {
            title: 'Service branch',
            value: record.serviceBranch,
            inline: true,
          },
          {
            title: 'Rank',
            value: record.rank,
            inline: true,
          },
          {
            title: 'Exposures',
            value: record.exposuresExist,
            inline: true,
          },
          {
            title: 'Location of service',
            value: record.locationOfService,
            inline: true,
          },
          // unknown field, check with UCD
          // {
          //   title: 'Onboard ship', // unknown
          //   value: record.?,
          //   inline: true,
          // },
          {
            title: 'Military occupational specialty',
            value: record.militaryOccupationalSpecialty,
            inline: true,
          },
          {
            title: 'Assignment',
            value: record.assignment,
            inline: true,
          },
          {
            title: 'Exposures',
            value: record.exposures,
            inline: true,
          },
          {
            title: 'Military service description',
            value: record.militaryServiceExperience,
            inline: true,
          },
        ],
      },
    ],
  };
};
