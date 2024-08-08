import {
  txtLine,
  txtLineDotted,
} from '@department-of-veterans-affairs/mhv/exports';

export const parseHealthConditions = records => {
  return `
${txtLine}
5) Health conditions

This list includes your current health conditions that VA providers are helping you manage. It may not include conditions non-VA providers are helping you manage.
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
