import {
  txtLine,
  txtLineDotted,
} from '@department-of-veterans-affairs/mhv/exports';

const formatVitals = vitals => {
  const typeArray = [];
  vitals.map(
    record => !typeArray.includes(record.type) && typeArray.push(record.type),
  );
  return typeArray;
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

export const parseVitals = records => {
  const vitalTypes = formatVitals(records);
  return `
${txtLine}
6) Vitals

This list includes vitals and other basic health numbers your providers check at your appointments.
${vitalTypes
    .map(
      vitalType => `
${vitalNameParse(vitalType)}
${txtLineDotted}
  ${records
    .filter(record => record.type === vitalType)
    .map(
      record => `
${record.dateTime}
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
