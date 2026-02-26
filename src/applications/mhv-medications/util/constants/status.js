export const ACTIVE_NON_VA = 'Active: Non-VA';

// Legacy statuses (VistA/MHV)
export const dispStatusObj = {
  unknown: 'Unknown',
  active: 'Active',
  refillinprocess: 'Active: Refill in Process',
  submitted: 'Active: Submitted',
  expired: 'Expired',
  discontinued: 'Discontinued',
  transferred: 'Transferred',
  nonVA: ACTIVE_NON_VA,
  onHold: 'Active: On Hold',
  activeParked: 'Active: Parked',
};

// New VA.gov statuses (OH)
export const dispStatusObjV2 = {
  statusNotAvailable: 'Status not available',
  active: 'Active',
  inprogress: 'In progress',
  inactive: 'Inactive',
  transferred: 'Transferred',
  nonVA: ACTIVE_NON_VA,
  expired: 'Expired',
};

export const dispStatusForRefillsLeft = [
  'Active',
  'Active: Parked',
  'Active: On Hold',
  'Active: Submitted',
  'Active: Refill in Process',
];

export const DISPENSE_STATUS = {
  NEW_ORDER: 'NewOrder',
  RENEW: 'Renew',
  ACTIVE: 'Active',
  ACTIVE_SUBMITTED: 'Active: Submitted',
  ACTIVE_REFILL_IN_PROCESS: 'Active: Refill in Process',
};
