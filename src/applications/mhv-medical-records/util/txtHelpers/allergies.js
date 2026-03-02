import { txtLineDotted } from '@department-of-veterans-affairs/mhv/exports';

export const parseAllergies = (records, index = 4) => {
  return `
${index}) Allergies

This list includes all vaccines (immunizations) in your VA medical records. For a list of your
allergies and reactions (including any reactions to vaccines), download your allergy records.

Showing ${records?.length} records from newest to oldest

${(records ?? [])
    .map(
      record => `
${record.name}
${txtLineDotted}
Date entered: ${record.date}
Signs and symptoms: ${(record.reaction ?? [])
        .map(reaction => `${reaction}`)
        .join(', ')}
Type of allergy: ${record.type}
Location: ${record.location}
Observed or historical: ${record.observedOrReported}
Provider notes: ${record.notes}
`,
    )
    .join('')}
`;
};
