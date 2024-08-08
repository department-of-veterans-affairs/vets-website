import { vitalTypeDisplayNames } from '../constants';

export const generateVitalsIntro = records => {
  return {
    title: `Vitals: ${vitalTypeDisplayNames[records[0].type]}`,
    subject: 'VA Medical Record',
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
