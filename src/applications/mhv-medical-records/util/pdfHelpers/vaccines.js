export const generateVaccinesIntro = (records, lastUpdated) => {
  return {
    title: 'Vaccines',
    subject: 'VA Medical Record',
    subtitles: [
      'This list includes all vaccines (immunizations) in your VA medical records. For a list of your allergies and reactions (including any reactions to vaccines), download your allergy records.',
      lastUpdated,
      `Showing ${records.length} records from newest to oldest`,
    ],
  };
};

export const generateVaccineItem = record => ({
  items: [
    {
      title: 'Date received',
      value: record.date,
      inline: true,
    },
    {
      title: 'Location',
      value: record.location,
      inline: true,
    },
  ],
});

export const generateVaccinesContent = records => ({
  results: {
    items: records.map(record => ({
      header: record.name,
      headerType: 'H2',
      ...generateVaccineItem(record),
    })),
  },
});
