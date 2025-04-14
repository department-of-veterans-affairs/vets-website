export const generateAllergiesIntro = (records, lastUpdated) => {
  return {
    title: 'Allergies and reactions',
    subject: 'VA Medical Record',
    subtitles: [
      'This list includes all allergies, reactions, and side effects in your VA medical records. If you have allergies or reactions that are missing from this list, tell your care team at your next appointment.',
      lastUpdated,
      `Showing ${records.length} records from newest to oldest`,
    ],
  };
};

export const generateAllergyItem = record => {
  const multipleReactions = record.reaction.length > 1;

  if (record.isOracleHealthData) {
    return {
      items: [
        {
          title: 'Date entered',
          value: record.date,
          inline: true,
        },
        {
          title: `Signs and symptoms${multipleReactions ? ':' : ''}`,
          value: multipleReactions
            ? [{ value: record.reaction }]
            : record.reaction[0],
          isRich: multipleReactions,
          inline: !multipleReactions,
        },
        {
          title: 'Type of allergy',
          value: record.type,
          inline: true,
        },
        {
          title: 'Provider',
          value: record.provider,
          inline: true,
        },
        {
          title: 'Provider notes',
          value: record.notes,
          inline: true,
        },
      ],
    };
  }

  return {
    items: [
      {
        title: 'Date entered',
        value: record.date,
        inline: true,
      },
      {
        title: `Signs and symptoms${multipleReactions ? ':' : ''}`,
        value: multipleReactions
          ? [{ value: record.reaction, indent: 0, paragraphGap: 0 }]
          : record.reaction[0],
        isRich: multipleReactions,
        inline: !multipleReactions,
      },
      {
        title: 'Type of allergy',
        value: record.type,
        inline: true,
      },
      {
        title: 'Location',
        value: record.location,
        inline: true,
      },
      {
        title: 'Observed or historical',
        value: record.observedOrReported,
        inline: true,
      },
      {
        title: 'Provider notes',
        value: record.notes,
        inline: true,
      },
    ],
  };
};

export const generateAllergiesContent = (records, isOracleHealthData) => ({
  results: {
    items: records.map(record => ({
      header: record.name,
      headerType: 'H2',
      ...generateAllergyItem({ ...record, isOracleHealthData }),
    })),
  },
});
