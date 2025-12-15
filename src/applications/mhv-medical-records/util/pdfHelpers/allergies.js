export const generateAllergiesIntro = (
  records,
  lastUpdated,
  hasMedsByMailFacility = false,
) => {
  // Conditional subtitle based on Meds by Mail facility
  const additionalInfo = hasMedsByMailFacility
    ? `This list includes all allergies, reactions, and side effects in your VA medical records. ` +
      `If you use Meds by Mail: We may not have your allergy records in our My HealtheVet tools. ` +
      `But the Meds by Mail servicing center keeps a record of your allergies and reactions to medications. ` +
      `If you have a new allergy or reaction, tell your provider. Or you can call us at 866-229-7389 or ` +
      `888-385-0235 (TTY:711) and ask us to update your records. We're here Monday through Friday, 8:00 a.m. to 7:30 p.m. ET.`
    : 'This list includes all allergies, reactions, and side effects in your VA medical records.';

  return {
    title: 'Allergies and reactions',
    subject: 'VA Medical Record',
    subtitles: [
      additionalInfo,
      lastUpdated,
      `Showing ${records?.length} records from newest to oldest`,
    ],
  };
};

export const generateAllergyItem = record => {
  const multipleReactions = record.reaction?.length > 1;

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
            ? [{ value: record.reaction, indent: 15, paragraphGap: 0 }]
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
          ? [{ value: record.reaction, indent: 15, paragraphGap: 0 }]
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
