import { sanitize, formatIsoDate, maskSsn } from './helpers';

export const transformDeathCertificateEntry = data => {
  const entry = data || {};
  const name = entry.DECENDENT_FULL_NAME || {};
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
          value: maskSsn(entry.DECENDENT_SSN),
        },
      ],
    },
    {
      heading: "Veteran's death information",
      rows: [
        {
          label: 'Disposition date',
          value: formatIsoDate(entry.DECENDENT_DATE_OF_DISPOSITION),
        },
        {
          label: 'Date of death',
          value: formatIsoDate(entry.DECENDENT_DATE_OF_DEATH),
        },
        { label: 'Cause of death A', value: sanitize(entry.CAUSE_OF_DEATH) },
        {
          label: 'Cause of death B',
          value: sanitize(entry.UNDERLYING_CAUSE_OF_DEATH_B),
        },
        {
          label: 'Cause of death C',
          value: sanitize(entry.UNDERLYING_CAUSE_OF_DEATH_C),
        },
        {
          label: 'Cause of death D',
          value: sanitize(entry.UNDERLYING_CAUSE_OF_DEATH_D),
        },
        { label: 'Manner of death', value: sanitize(entry.MANNER_OF_DEATH) },
        {
          label: 'Marital status at time of death',
          value: sanitize(entry.DECENDENT_MARITAL_STATUS),
        },
      ],
    },
  ];
};
