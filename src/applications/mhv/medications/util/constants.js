export const rxListSortingOptions = {
  availableToFillOrRefillFirst: {
    API_ENDPOINT:
      '&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date',
    LABEL: 'Available to fill or refill first',
  },
  lastFilledFirst: {
    API_ENDPOINT: '&sort[]=dispensed_date&sort[]=prescription_name',
    LABEL: 'Last filled first',
  },
  alphabeticalOrder: {
    API_ENDPOINT: '&sort[]=prescription_name&sort[]=dispensed_date',
    LABEL: 'Alphabetical Order',
  },
};

export const medicationsUrls = {
  MEDICATIONS_URL: '/my-health/medications',
  MEDICATIONS_LOGIN: '/my-health/medications?next=loginModal&oauth=true',
};

export const dispStatusForRefillsLeft = [
  'Active',
  'Active: Parked',
  'Active: On Hold',
  'Active: Submitted',
  'Active: Refill in process',
];

export const imageRootUri = 'https://www.myhealth.va.gov/static/MILDrugImages/';

export const dispStatusObj = {
  unknown: 'Unknown',
  active: 'Active',
  refillinprocess: 'Active: Refill in Process',
  submitted: 'Active: Submitted',
  expired: 'Expired',
  discontinued: 'Discontinued',
  transferred: 'Transferred',
  nonVA: 'Active: Non-VA',
  onHold: 'Active: On Hold',
  activeParked: 'Active: Parked',
};
