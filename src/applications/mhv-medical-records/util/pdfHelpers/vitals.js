import { vitalTypeDisplayNames } from '../constants';

export const generateVitalsIntro = (records, lastUpdated) => {
  return {
    title: vitalTypeDisplayNames[records[0].type],
    subject: 'VA Medical Record',
    subtitles: [
      'Vitals are basic health numbers your providers check at your appointments.',
      lastUpdated,
      `Showing ${records?.length} records from newest to oldest`,
    ],
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

// used for vital details page
export const generateVitalContent = records => ({
  results: {
    items: records.map(record => ({
      ...generateVitalsItem(record),
    })),
  },
});

// used for Blue Button
export const generateVitalsContent = records => ({
  results: {
    header: records[0].name,
    headerType: 'H3',
    headerIndent: 30,
    preface: `Showing ${records?.length} records, from newest to oldest`,
    prefaceIndent: 30,
    sectionSeparators: false,
    items: records.map(record => ({
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
