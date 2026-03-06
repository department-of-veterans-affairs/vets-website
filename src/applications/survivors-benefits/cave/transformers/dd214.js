import { sanitize, formatIsoDate, maskSsn } from './helpers';

export const transformDd214Entry = data => {
  const entry = data || {};
  return [
    {
      heading: "Veteran's information",
      rows: [
        { label: 'First name', value: sanitize(entry.FIRST_NAME) },
        { label: 'Middle name', value: sanitize(entry.MIDDLE_NAME) },
        { label: 'Last name', value: sanitize(entry.LAST_NAME) },
        { label: 'Suffix', value: sanitize(entry.SUFFIX) },
        {
          label: 'Social Security number',
          value: maskSsn(entry.SOCIAL_SECURITY_NUMBER),
        },
        { label: 'Date of birth', value: formatIsoDate(entry.DATE_OF_BIRTH) },
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
          value: formatIsoDate(entry.DATE_SEPARATED_ACTIVE_SERVICE),
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
