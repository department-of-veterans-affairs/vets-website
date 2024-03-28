import { vitalTypeDisplayNames } from '../constants';

export const generateVitalsIntro = () => {
  return {
    title: `Vitals`,
    subject: 'VA Medical Record',
    preface:
      'This list includes vitals and other basic health numbers your providers check at your appointments.',
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
    header: vitalTypeDisplayNames[records[0].type],
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
