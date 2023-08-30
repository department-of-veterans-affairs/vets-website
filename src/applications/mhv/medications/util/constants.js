export const rxListSortingOptions = [
  {
    ACTIVE: {
      label: 'Active',
      value: 'Active',
    },
  },
  {
    ACTIVE_ON_HOLD: {
      label: 'Active: On hold',
      value: 'Active: On Hold',
    },
  },
  {
    ACTIVE_NON_VA: {
      label: 'Active: Non-VA',
      value: 'Active: Non-VA',
    },
  },
  {
    ACTIVE_ON_PROVIDER_HOLD: {
      label: 'Active: On provider hold',
      value: 'Active: On ProviderHold',
    },
  },
  {
    ACTIVE_PARKED: {
      label: 'Active: Parked',
      value: 'activeParked',
    },
  },
  {
    ACTIVE_REFILL_IN_PROCESS: {
      label: 'Active: Refill in process',
      value: 'refillinprocess',
    },
  },
  {
    ACTIVE_SUBMITTED: {
      label: 'Active: Submitted',
      value: 'Active: Submitted',
    },
  },
  {
    EXPIRED: {
      label: 'Expired',
      value: 'Expired',
    },
  },
  {
    DISCONTINUED: {
      label: 'Discontinued',
      value: 'Discontinued',
    },
  },
  {
    TRANSFERRED: {
      label: 'Transferred',
      value: 'Transferred',
    },
  },
  {
    UNKNOWN: {
      label: 'Unknown',
      value: 'Unknown',
    },
  },
];

export const medicationsUrls = {
  medicationsUrl: '/my-health/medications',
  medicationsLogin: '/my-health/medications?next=loginModal&oauth=true',
};
