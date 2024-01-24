import { processList } from '../helpers';

export const generateAllergiesIntro = records => {
  return {
    title: 'Allergies',
    subject: 'VA Medical Record',
    preface: `This list includes all allergies, reactions, and side-effects in your VA medical records. If you have allergies or reactions that are missing from this list, tell your care team at your next appointment.\n\nShowing ${
      records.length
    } records from newest to oldest`,
  };
};

export const generateAllergyItem = record => ({
  items: [
    {
      title: 'Date entered',
      value: record.date,
      inline: true,
    },
    {
      title: 'Signs and symptoms',
      value: processList(record.reaction),
      inline: true,
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
      inline: !record.notes,
    },
  ],
});

export const generateAllergiesContent = records => ({
  results: {
    items: records.map(record => ({
      header: record.name,
      ...generateAllergyItem(record),
    })),
  },
});
