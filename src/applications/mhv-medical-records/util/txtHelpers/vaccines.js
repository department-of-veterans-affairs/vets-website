import {
  txtLine,
  txtLineDotted,
} from '@department-of-veterans-affairs/mhv/exports';

export const parseVaccines = records => {
  return `
${txtLine}
3) Vaccines

This list includes vaccines you got at VA health facilities and from providers or pharmacies in our community care network. It may not include vaccines you got outside our network.
For complete records of your allergies and reactions to vaccines, review your allergy records in this report.

${records
    .map(
      record =>
        `
${record.name}
${txtLineDotted}
${`Date received: ${record.date}`}
${`Location: ${record.location}`}
Provider notes
${record.notes.map(note => `${note}`)}
            `,
    )
    .join('')}
    `;
};
