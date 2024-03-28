import { processList } from '../helpers';

export const generateVaccinesIntro = () => {
  return {
    title: 'Vaccines',
    subject: 'VA Medical Record',
    preface:
      'This list includes all vaccines (immunizations) in your VA medical records. For a list of your allergies and reactions (including any reactions to vaccines), download your allergy records.',
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
    {
      title: 'Provider notes',
      value: processList(record.notes),
      inline: !record.notes.length,
    },
  ],
});

export const generateVaccinesContent = records => ({
  results: {
    items: records.map(record => ({
      header: record.name,
      ...generateVaccineItem(record),
    })),
  },
});
