import { sanitize, formatIsoDate, maskSsn } from './helpers';

export const transformDd214Entry = data => {
  const entry = data || {};
  const name = entry.VETERAN_NAME || {};
  return [
    {
      heading: "Veteran's information",
      rows: [
        { label: 'First name', value: sanitize(name.first) },
        { label: 'Middle name', value: sanitize(name.middle) },
        { label: 'Last name', value: sanitize(name.last) },
        { label: 'Suffix', value: sanitize(name.suffix) },
        {
          label: 'Social Security number',
          value: maskSsn(entry.VETERAN_SSN),
        },
        { label: 'Date of birth', value: formatIsoDate(entry.VETERAN_DOB) },
      ],
    },
    {
      heading: 'Service information',
      rows: [
        {
          label: 'Branch of service',
          value: sanitize(entry.BRANCH_OF_SERVICE),
        },
        {
          label: 'Grade, rate, or rank',
          value: sanitize(entry.GRADE_RATE_RANK),
        },
        { label: 'Pay grade', value: sanitize(entry.PAY_GRADE) },
        { label: 'Date inducted', value: formatIsoDate(entry.DATE_INDUCTED) },
        {
          label: 'Date entered active service',
          value: formatIsoDate(entry.DATE_ENTERED_ACTIVE_SERVICE),
        },
        {
          label: 'Date separated active service',
          value: formatIsoDate(entry.DATE_SEPARATED_FROM_SERVICE),
        },
        {
          label: 'Cause of separation',
          value: sanitize(entry.CAUSE_OF_SEPARATION),
        },
        { label: 'Separation type', value: sanitize(entry.SEPARATION_TYPE) },
        { label: 'Separation code', value: sanitize(entry.SEPARATION_CODE) },
      ],
    },
  ];
};
