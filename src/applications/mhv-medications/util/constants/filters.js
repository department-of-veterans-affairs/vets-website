// Filter keys
export const ALL_MEDICATIONS_FILTER_KEY = 'ALL_MEDICATIONS';
export const ACTIVE_FILTER_KEY = 'ACTIVE';
export const RECENTLY_REQUESTED_FILTER_KEY = 'RECENTLY_REQUESTED';
export const RENEWAL_FILTER_KEY = 'RENEWAL';
export const RENEWABLE_FILTER_KEY = 'RENEWABLE';
export const NON_ACTIVE_FILTER_KEY = 'NON_ACTIVE';
export const INACTIVE_FILTER_KEY = 'INACTIVE';
export const IN_PROGRESS_FILTER_KEY = 'IN_PROGRESS';
export const SHIPPED_FILTER_KEY = 'SHIPPED';
export const TRANSFERRED_FILTER_KEY = 'TRANSFERRED';
export const STATUS_NOT_AVAILABLE_FILTER_KEY = 'STATUS_NOT_AVAILABLE';

// Legacy filter options (VistA/MHV statuses)
export const filterOptions = {
  [ALL_MEDICATIONS_FILTER_KEY]: {
    label: 'All medications',
    description: 'All medications in your VA medical records',
    url: '',
    showingContentDisplayName: '',
  },
  [ACTIVE_FILTER_KEY]: {
    label: 'Active',
    name: 'filter option',
    description: 'Active prescriptions and non-VA medications',
    url:
      '&filter[[disp_status][eq]]=Active,Active: Refill in Process,Active: Non-VA,Active: On Hold,Active: Parked,Active: Submitted',
    showingContentDisplayName: ' active',
  },
  [RECENTLY_REQUESTED_FILTER_KEY]: {
    label: 'Recently requested',
    name: 'filter option',
    description: 'Refill requests in process or shipped in the last 15 days',
    url:
      '&filter[[disp_status][eq]]=Active: Refill in Process,Active: Submitted',
    showingContentDisplayName: ' recently requested',
  },
  [RENEWAL_FILTER_KEY]: {
    label: 'Renewal needed before refill',
    name: 'filter option',
    description:
      'Prescriptions that need renewal (no refills left or expired in last 120 days)',
    url: '&filter[[disp_status][eq]]=Active,Expired',
    showingContentDisplayName: ' renewal needed before refill',
  },
  [NON_ACTIVE_FILTER_KEY]: {
    label: 'Non-active',
    name: 'filter option',
    description:
      'Prescriptions that are discontinued, expired, or have an unknown status',
    url: '&filter[[disp_status][eq]]=Discontinued,Expired,Transferred,Unknown',
    showingContentDisplayName: ' non-active',
  },
};

// New VA.gov filter options for OH statuses
export const filterOptionsV2 = {
  [ALL_MEDICATIONS_FILTER_KEY]: {
    label: 'All medications',
    description: 'All medications in your VA medical records',
    url: '',
    showingContentDisplayName: '',
  },
  [ACTIVE_FILTER_KEY]: {
    label: 'Active',
    name: 'filter option',
    description: `Includes prescriptions you’re actively taking that have refills or prescriptions you can refill by contacting your provider`,
    url: '&filter[[disp_status][eq]]=Active',
    showingContentDisplayName: ' active',
  },
  [IN_PROGRESS_FILTER_KEY]: {
    label: 'In progress',
    name: 'filter option',
    description:
      'Includes refill requests you submitted and refills the VA pharmacy is processing',
    url: '&filter[[disp_status][eq]]=In progress',
    showingContentDisplayName: ' in progress',
  },
  [SHIPPED_FILTER_KEY]: {
    label: 'Shipped',
    name: 'filter option',
    description: 'Includes refills with current tracking information available',
    url: '&filter[[disp_status][eq]]=Active&filter[[is_trackable][eq]]=true',
    showingContentDisplayName: ' shipped',
  },
  [RENEWABLE_FILTER_KEY]: {
    label: 'Renewal needed before refill',
    name: 'filter option',
    description: `Includes prescriptions you’re taking that have no refills left`,
    url: '&filter[[is_renewable][eq]]=true',
    showingContentDisplayName: ' renewal needed before refill',
  },
  [INACTIVE_FILTER_KEY]: {
    label: 'Inactive',
    name: 'filter option',
    description:
      'Includes prescriptions you can’t refill without contacting your provider first',
    url: '&filter[[disp_status][eq]]=Inactive',
    showingContentDisplayName: ' inactive',
  },
  [TRANSFERRED_FILTER_KEY]: {
    label: 'Transferred',
    name: 'filter option',
    description: `A prescription moved to VA’s new electronic health record`,
    url: '&filter[[disp_status][eq]]=Transferred',
    showingContentDisplayName: ' transferred',
  },
  [STATUS_NOT_AVAILABLE_FILTER_KEY]: {
    label: 'Status not available',
    name: 'filter option',
    description: '',
    url: '&filter[[disp_status][eq]]=Status not available',
    showingContentDisplayName: ' status not available',
  },
};
