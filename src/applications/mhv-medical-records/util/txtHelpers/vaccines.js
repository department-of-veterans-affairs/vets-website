import { txtLineDotted } from '@department-of-veterans-affairs/mhv/exports';

export const parseVaccines = (records, index = 3) => {
  return `
${index}) Vaccines

This list includes all vaccines (immunizations) in your VA medical records. For a list of your
allergies and reactions (including any reactions to vaccines), download your allergy records.

Showing ${records?.length} records from newest to oldest

${records
    .map(
      record =>
        `
${record.name}
${txtLineDotted}
${`Date received: ${record.date}`}
${`Location: ${record.location}`}
Provider notes
${(record.notes ?? []).map(note => `${note}`)}
            `,
    )
    .join('')}
    `;
};
