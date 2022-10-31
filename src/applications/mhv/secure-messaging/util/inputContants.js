export const DateRanges = [
  { value: 'any', label: 'Any' },
  { value: 'last3', label: 'Last 3 months' },
  { value: 'last6', label: 'Last 6 months' },
  { value: 'last12', label: 'Last 12 months' },
  { value: 'custom', label: 'Custom date range' },
];

export const SelectCategories = [
  {
    value: '',
    label: ' ',
  },
  {
    value: 'other',
    label: 'General',
  },
  {
    value: 'covid',
    label: 'COVID',
  },
  {
    value: 'appointment',
    label: 'Appointment',
  },
  {
    value: 'medication',
    label: 'Medication',
  },
  {
    value: 'test',
    label: 'Test',
  },
  {
    value: 'education',
    label: 'Education',
  },
];

export const RadioCategories = {
  OTHER: {
    id: 'category-general',
    value: 'OTHER',
    label: 'General',
    description: 'Ask questions about non urgent, non-emergency issues',
  },
  COVID: {
    id: 'category-COVID',
    value: 'COVID',
    label: 'COVID',
    description: 'Ask COVID related questions',
  },
  APPOINTMENTS: {
    id: 'category-appointment',
    value: 'APPOINTMENTS',
    label: 'Appointment',
    description: 'Request an appointment or ask about an existing appointment',
  },
  MEDICATIONS: {
    id: 'category-medication',
    value: 'MEDICATIONS',
    label: 'Medication',
    description:
      'Request to renew a medication or ask a question about medication',
  },
  TEST_RESULTS: {
    id: 'category-test',
    value: 'TEST_RESULTS',
    label: 'Test',
    description:
      'Ask a question about a test/lab result or about a future test or procedure',
  },
  EDUCATION: {
    id: 'category-education',
    value: 'EDUCATION',
    label: 'Education',
    description: 'Request health education information',
  },
};
