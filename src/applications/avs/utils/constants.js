const APPOINTMENT_TYPES = {
  RECALL: {
    key: 'RECALL',
    label: 'Recall',
  },
  SCHEDULED: {
    key: 'SCHEDULED',
    label: 'Scheduled',
  },
};

const ORDER_TYPES = {
  CONSULT: {
    key: 'CONSULT',
    label: 'Consultations',
  },
  IMAGING: {
    key: 'IMAGING',
    label: 'Imaging',
  },
  LAB: {
    key: 'LAB',
    label: 'Lab Tests',
  },
  MED: {
    key: 'MED',
    label: 'Medications',
  },
  OTHER: {
    key: 'OTHER',
    label: 'Other Orders',
  },
};

const MEDICATION_SOURCES = {
  VA: 'VA',
  NON_VA: 'Non-VA',
};

const MEDICATION_TYPES = {
  DRUG: 'drug',
  SUPPLY: 'supply',
};

export { APPOINTMENT_TYPES, MEDICATION_SOURCES, MEDICATION_TYPES, ORDER_TYPES };
