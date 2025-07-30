import { txtLineDotted } from '@department-of-veterans-affairs/mhv/exports';

export const parseHealthConditions = (records, index = 5) => {
  return `
${index}) Health conditions

This list includes the same information as your "VA problem list" in the 
previous My HealtheVet experience.

About the codes in some condition names: Some of your health conditions may have diagnosis
codes in the name that start with SCT or ICD. Providers use these codes to track your health
conditions and to communicate with other providers about your care. If you have a question about
these codes or a health condition, ask your provider at your next appointment.

Showing ${records?.length} records from newest to oldest

${records
    .map(
      record => `
${record.name}
${txtLineDotted}
Date: ${record.date}
Provider: ${record.provider}
Provider Notes
Status of health condition: ${record.active}
Location: ${record.facility}
SNOMED Clinical term: ${record.name}
`,
    )
    .join('')}
`;
};
