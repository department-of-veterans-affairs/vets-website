import { txtLineDotted } from '@department-of-veterans-affairs/mhv/exports';

// Extracts unique vital types from a list of vital records.
const formatVitals = vitals => {
  return [...new Set((vitals ?? []).map(record => record.type))];
};

const vitalNameParse = name => {
  let parsedName = name;
  const excludeArray = [
    'PAIN',
    'CENTRAL_VENOUS_PRESSURE',
    'CIRCUMFERENCE_GIRTH',
  ];
  if (name === 'RESPIRATION') parsedName = 'Breathing rate';
  if (name === 'PULSE') parsedName = 'Heart rate';
  if (name === 'PULSE_OXIMETRY') parsedName = 'Blood oxygen level';
  if (excludeArray.includes(name)) parsedName = '';
  return parsedName;
};

export const parseVitals = (records, index = 6) => {
  const vitalTypes = formatVitals(records);
  return `
${index}) Vitals

Vitals are basic health numbers your providers check at your appointments.
${vitalTypes
  .map(
    vitalType => `
${vitalNameParse(vitalType)}
${txtLineDotted}
  ${(records ?? [])
    .filter(record => record.type === vitalType)
    .map(
      record => `
${record.date}
Result: ${record.measurement}
Location: ${record.location}
Provider Notes: ${record.notes}
`,
    )
    .join('')}
`,
  )
  .join('')}
`;
};
