import {
  txtLine,
  txtLineDotted,
} from '@department-of-veterans-affairs/mhv/exports';

export const parseAllergies = records => {
  return `
${txtLine}
4) Allergies

If you have allergies that are missing from this list, send a secure message to your care team.
${records
    .map(
      record => `
${record.name}
${txtLineDotted}
Date entered: ${record.date}
Signs and symptoms: ${record.reaction.map(reaction => `${reaction}`).join(', ')}
Type of allergy: ${record.type}
Location: ${record.location}
Observed or historical: ${record.observedOrReported}
Provider notes: ${record.notes}
`,
    )
    .join('')}
`;
};
