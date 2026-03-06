import { sanitize, formatIsoDate, maskSsn } from './helpers';

export const transformDeathCertificateEntry = data => {
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
      ],
    },
    {
      heading: "Veteran's death information",
      rows: [
        {
          label: 'Disposition date',
          value: formatIsoDate(entry.DISPOSITION_DATE),
        },
        { label: 'Date of death', value: formatIsoDate(entry.DATE_OF_DEATH) },
        { label: 'Cause of death A', value: sanitize(entry.CAUSE_OF_DEATH_A) },
        { label: 'Cause of death B', value: sanitize(entry.CAUSE_OF_DEATH_B) },
        { label: 'Cause of death C', value: sanitize(entry.CAUSE_OF_DEATH_C) },
        { label: 'Cause of death D', value: sanitize(entry.CAUSE_OF_DEATH_D) },
        {
          label: 'Cause of death (Other)',
          value: sanitize(entry.CAUSE_OF_DEATH_OTHER),
        },
        { label: 'Manner of death', value: sanitize(entry.MANNER_OF_DEATH) },
        {
          label: 'Marital status at time of death',
          value: sanitize(entry.MARITAL_STATUS_AT_TIME_OF_DEATH),
        },
      ],
    },
  ];
};
