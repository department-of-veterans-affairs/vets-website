export const generateDownloadIntro = (records, lastUpdatedIndicator) => {
  return {
    title: 'Download',
    preface: `VA Medical Record\n\n${lastUpdatedIndicator}\n\n`,
  };
};

export const generateDownloadItem = record => ({
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

export const generateDownloadContent = records => ({
  results: {
    items: records.map(record => ({
      header: record.name,
      ...generateDownloadItem(record),
    })),
  },
});
