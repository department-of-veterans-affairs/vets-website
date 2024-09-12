import { processList } from '../helpers';

<<<<<<< HEAD
export const generateVaccinesIntro = (lastUpdatedIndicator) => {
  return {
    title: 'Vaccines',
    subject: 'VA Medical Record\n\n' + lastUpdatedIndicator,
    preface:
      'This list includes all vaccines (immunizations) in your VA medical records. For a list of your allergies and reactions (including any reactions to vaccines), download your allergy records.',
=======
export const generateVaccinesIntro = records => {
  return {
    title: 'Vaccines',
    subject: 'VA Medical Record',
    preface: `This list includes all vaccines (immunizations) in your VA medical records. For a list of your allergies and reactions (including any reactions to vaccines), download your allergy records. \n
Showing ${records.length} records from newest to oldest`,
>>>>>>> origin/main
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
      inline: true,
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
