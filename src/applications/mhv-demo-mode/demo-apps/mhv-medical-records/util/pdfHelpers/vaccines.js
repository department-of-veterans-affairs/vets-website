export const generateVaccinesIntro = (records, lastUpdated) => {
  return {
    title: 'Vaccines',
    subject: 'VA Medical Record',
    subtitles: [
      'This list includes all vaccines (immunizations) in your VA medical records. For a list of your allergies and reactions (including any reactions to vaccines), download your allergy records. ',
      lastUpdated,
      `Showing ${records?.length} records from newest to oldest`,
    ],
  };
};

export const generateVaccineItem = record => {
  const items = [
    {
      title: 'Date received',
      value: record.date,
      inline: true,
    },
    {
      title: 'Location',
      value: record.location || 'None recorded',
      inline: true,
    },
  ];

  // Add additional fields if they exist (for accelerated vaccines)
  if (record.shortDescription) {
    items.push({
      title: 'Type and dosage',
      value: record.shortDescription,
      inline: true,
    });
  }

  if (record.manufacturer) {
    items.push({
      title: 'Manufacturer',
      value: record.manufacturer,
      inline: true,
    });
  }

  if (record.doseDisplay) {
    items.push({
      title: 'Series status',
      value: record.doseDisplay,
      inline: true,
    });
  }

  if (record.reaction) {
    items.push({
      title: 'Reactions',
      value: record.reaction,
      inline: false,
    });
  }

  if (record.note) {
    items.push({
      title: 'Notes',
      value: record.note,
      inline: false,
    });
  }

  return { items };
};

export const generateVaccinesContent = records => ({
  results: {
    items: records.map(record => ({
      header: record.name,
      headerType: 'H2',
      ...generateVaccineItem(record),
    })),
  },
});
