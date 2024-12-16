import { txtLineDotted } from '@department-of-veterans-affairs/mhv/exports';
import { loincCodes } from '../constants';

export const parseCareSummariesAndNotes = (records, index = 2) => {
  return `
${index}) Care summaries and notes

This report only includes care summaries and notes from 2013 and later.
For after-visit summaries, (summaries of your appointments with VA providers), go to your appointment records.

${records
    .map(
      record =>
        `${
          record.type === loincCodes.PHYSICIAN_PROCEDURE_NOTE ||
          record.type === loincCodes.CONSULT_RESULT
            ? `
${record.name}
${txtLineDotted}

Details
  
  Date: ${record.date}
  Location: ${record.location}
  Written by: ${record.writtenBy}
  Signed by: ${record.signedBy}
  Date signed: ${record.dateSigned}

Notes
  ${record.note}
`
            : `

${record.name}
${txtLineDotted}

Details
  Location: ${record.location}
  Date admitted: ${record.admissionDate}
  Date discharged: ${record.dischargeDate}
  Discharged by: ${record.dischargedBy}

Summary
  ${record.summary}
              `
        }`,
    )
    .join('')}

`;
};
