const EMPTY_VALUE = '—';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const sanitize = value => {
  if (value === null || value === undefined) {
    return EMPTY_VALUE;
  }
  if (typeof value === 'string' && value.trim().length === 0) {
    return EMPTY_VALUE;
  }
  return value;
};

const formatDate = value => {
  if (!value || typeof value !== 'string') {
    return EMPTY_VALUE;
  }
  const parts = value.split('-');
  if (parts.length !== 3) {
    return sanitize(value);
  }
  const [month, day, year] = parts.map(part => parseInt(part, 10));
  if (
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    Number.isNaN(year) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return sanitize(value);
  }
  const monthName = MONTH_NAMES[month - 1];
  return `${monthName} ${day}, ${year}`;
};

const maskSsn = value => {
  if (!value || typeof value !== 'string') {
    return EMPTY_VALUE;
  }
  return value.replace(/\d(?=\d{4})/g, '*');
};

const transformDd214Entry = data => {
  const entry = data || {};
  return [
    {
      heading: 'Veteran information',
      rows: [
        { label: 'First name', value: sanitize(entry.FIRST_NAME) },
        { label: 'Middle name', value: sanitize(entry.MIDDLE_NAME) },
        { label: 'Last name', value: sanitize(entry.LAST_NAME) },
        { label: 'Suffix', value: sanitize(entry.SUFFIX) },
        {
          label: 'Social Security number',
          value: maskSsn(entry.SOCIAL_SECURITY_NUMBER),
        },
        { label: 'Date of birth', value: formatDate(entry.DATE_OF_BIRTH) },
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
        { label: 'Date inducted', value: formatDate(entry.DATE_INDUCTED) },
        {
          label: 'Date entered active service',
          value: formatDate(entry.DATE_ENTERED_ACTIVE_SERVICE),
        },
        {
          label: 'Date separated active service',
          value: formatDate(entry.DATE_SEPARATED_ACTIVE_SERVICE),
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

const transformDeathCertificateEntry = data => {
  const entry = data || {};
  return [
    {
      heading: 'Decedent information',
      rows: [
        { label: 'First name', value: sanitize(entry.FIRST_NAME) },
        { label: 'Middle name', value: sanitize(entry.MIDDLE_NAME) },
        { label: 'Last name', value: sanitize(entry.LAST_NAME) },
        { label: 'Suffix', value: sanitize(entry.SUFFIX) },
        {
          label: 'Social Security number',
          value: maskSsn(entry.SOCIAL_SECURITY_NUMBER),
        },
        {
          label: 'Marital status at time of death',
          value: sanitize(entry.MARITAL_STATUS_AT_TIME_OF_DEATH),
        },
      ],
    },
    {
      heading: 'Death certificate information',
      rows: [
        {
          label: 'Disposition date',
          value: formatDate(entry.DISPOSITION_DATE),
        },
        { label: 'Date of death', value: formatDate(entry.DATE_OF_DEATH) },
        { label: 'Cause of death A', value: sanitize(entry.CAUSE_OF_DEATH_A) },
        { label: 'Cause of death B', value: sanitize(entry.CAUSE_OF_DEATH_B) },
        { label: 'Cause of death C', value: sanitize(entry.CAUSE_OF_DEATH_C) },
        { label: 'Cause of death D', value: sanitize(entry.CAUSE_OF_DEATH_D) },
        {
          label: 'Cause of death (Other)',
          value: sanitize(entry.CAUSE_OF_DEATH_OTHER),
        },
        { label: 'Manner of death', value: sanitize(entry.MANNER_OF_DEATH) },
      ],
    },
  ];
};

export const transformArtifactsToSections = artifacts => {
  const results = {};
  if (artifacts?.dd214?.length) {
    results.DD214 = artifacts.dd214.map(transformDd214Entry);
  }
  if (artifacts?.deathCertificates?.length) {
    results['Death certificate'] = artifacts.deathCertificates.map(
      transformDeathCertificateEntry,
    );
  }
  return results;
};

export default transformArtifactsToSections;
