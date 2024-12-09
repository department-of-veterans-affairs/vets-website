import { vitalTypeDisplayNames } from '../constants';

export const generateVitalsIntro = (records, lastUpdatedIndicator) => {
  return {
    title: `Vitals: ${vitalTypeDisplayNames[records[0].type]}`,
    preface: `VA Medical Record\n\n${lastUpdatedIndicator}\n\nShowing ${
      records.length
    } records from newest to oldest`,
  };
};

export const generateVitalsItem = record => ({
  header: record.date,
  items: [
    {
      title: 'Result',
      value: record.measurement,
      inline: true,
    },
    {
      title: 'Location',
      value: record.location,
      inline: true,
    },
    {
      title: 'Provider notes',
      value: record.notes,
      inline: true,
    },
  ],
});

export const generateVitalsContent = records => ({
  results: {
    items: records.map(record => ({
      header: record.name,
      ...generateVitalsItem(record),
    })),
  },
});

export const generateVitalsContentByType = records => {
  const content = {};
  records.forEach(record => {
    if (!content[record.type]) content[record.type] = [];
    content[record.type].push(record);
  });
  return Object.keys(content).map(key => generateVitalsContent(content[key]));
};
