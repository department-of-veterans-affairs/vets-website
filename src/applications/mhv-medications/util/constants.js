export const rxListSortingOptions = {
  alphabeticallyByStatus: {
    API_ENDPOINT: '&sort=alphabetical-status',
    LABEL: 'Alphabetically by status',
  },
  lastFilledFirst: {
    API_ENDPOINT: '&sort=last-fill-date',
    LABEL: 'Last filled first',
  },
  alphabeticalOrder: {
    API_ENDPOINT: '&sort=alphabetical-rx-name',
    LABEL: 'Alphabetically by name',
  },
};

export const medicationsUrls = {
  VA_HOME: '/../../../',
  MHV_HOME: '/../../my-health',
  MEDICATIONS_URL: '/my-health/medications',
  MEDICATIONS_LOGIN: '/my-health/medications?next=loginModal&oauth=true',
  // TODO: remove once mhvMedicationsRemoveLandingPage is turned on in prod
  MEDICATIONS_ABOUT: '/my-health/medications/about',
  MEDICATIONS_ABOUT_ACCORDION_RENEW:
    '/my-health/medications/about#accordion-renew-rx',
  MEDICATIONS_REFILL: '/my-health/medications/refill',
  PRESCRIPTION_DETAILS: '/my-health/medications/prescription',
  subdirectories: {
    BASE: '/',
    // TODO: remove once mhvMedicationsRemoveLandingPage is turned on in prod
    ABOUT: '/about',
    REFILL: '/refill',
    DETAILS: '/prescription',
    DOCUMENTATION: '/documentation',
  },
};

export const ALL_MEDICATIONS_FILTER_KEY = 'ALL_MEDICATIONS';
export const ACTIVE_FILTER_KEY = 'ACTIVE';
export const RECENTLY_REQUESTED_FILTER_KEY = 'RECENTLY_REQUESTED';
export const RENEWAL_FILTER_KEY = 'RENEWAL';
export const NON_ACTIVE_FILTER_KEY = 'NON_ACTIVE';

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
      'Prescriptions that just ran out of refills or became too old to refill (expired)',
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

export const dispStatusForRefillsLeft = [
  'Active',
  'Active: Parked',
  'Active: On Hold',
  'Active: Submitted',
  'Active: Refill in Process',
];

export const imageRootUri = 'https://www.myhealth.va.gov/static/MILDrugImages/';

export const pdfStatusDefinitions = {
  active: [
    {
      value:
        'This is a current prescription. If you have refills left, you can request a refill now. If you have no refills left, you’ll need to request a renewal instead.',
    },
  ],
  activeParked: [
    {
      value: `Your VA provider prescribed this medication or supply to you. But we won’t send any shipments until you request to fill or refill it.`,
    },
    {
      value: `We may use this status for either of these reasons:`,
    },
    {
      value: [
        `We’re not sure when you’ll need to fill this prescription, or`,
        `You told us you have too much of this medication or supply`,
      ],
    },
    {
      value: `If you need this prescription now, you can request to fill or refill it.`,
    },
  ],
  hold: [
    {
      value: `We put a hold on this prescription. You can’t request a refill until we remove the hold.`,
    },
    {
      value: `We may use this status for either of these reasons:`,
    },
    {
      value: [
        `You told us you have too much of this medication or supply, or`,
        `There’s a problem with this prescription`,
      ],
    },
    {
      value: `If you need this prescription now, call your VA pharmacy.`,
    },
  ],
  refillinprocess: [
    {
      value: `We’re processing a fill or refill for this prescription. We’ll update the status here when we ship your prescription.`,
    },
  ],
  discontinued: [
    {
      value: `You can’t refill this prescription. We may use this status for either of these reasons:`,
    },
    {
      value: [
        `Your provider stopped prescribing this medication or supply to you, or`,
        `You have a new prescription for the same medication or supply`,
      ],
    },
    {
      value: `If you have questions or need a new prescription, send a message to your care team.`,
    },
  ],
  submitted: [
    {
      value: `We got your request to fill or refill this prescription. We’ll update the status when we process your request.`,
    },
    {
      value: `Check back for updates. If we don’t update the status within 3 days after your request, call your VA pharmacy.`,
    },
  ],
  expired: [
    {
      value: `This prescription is too old to refill.`,
    },
    {
      value: `An expired prescription doesn’t mean the medication itself is expired.`,
    },
    {
      value: `Check the prescription label for the expiration date of the medication.`,
    },
    {
      value: `If you need more of this prescription, request a renewal.`,
    },
  ],
  transferred: [
    {
      value: `We moved this prescription to our My VA Health portal.`,
    },
  ],
};

export const pdfDefaultStatusDefinition = [
  {
    value: `We can’t access information about this prescription right now.`,
  },
];

export const nonVAMedicationTypes = `* Prescriptions you filled through a non-VA pharmacy
* Over-the-counter medications, supplements, and herbal remedies
* Sample medications a provider gave you
* Other drugs you’re taking that you don’t have a prescription for, including recreational drugs`;

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

export const SESSION_SELECTED_SORT_OPTION = 'SESSION_SELECTED_SORT_OPTION';
export const SESSION_SELECTED_FILTER_OPTION = 'SESSION_SELECTED_FILTER_OPTION';
export const SESSION_RX_FILTER_OPEN_BY_DEFAULT =
  'SESSION_RX_FILTER_OPEN_BY_DEFAULT';
export const SESSION_SELECTED_PAGE_NUMBER = 'SESSION_SELECTED_PAGE_NUMBER';

export const INCLUDE_IMAGE_ENDPOINT = '&include_image=true';

export const PDF_TXT_GENERATE_STATUS = {
  NotStarted: 'PDF_GENERATE_NOT_STARTED',
  InProgress: 'PDF_GENERATE_IN_PROGRESS',
  Success: 'PDF_GENERATE_SUCCESS',
};

export const DOWNLOAD_FORMAT = {
  PDF: 'PDF',
  TXT: 'TXT',
};

export const PRINT_FORMAT = {
  PRINT: 'print',
  PRINT_FULL_LIST: 'print-full-list',
};

export const defaultSelectedSortOption =
  sessionStorage.getItem(SESSION_SELECTED_SORT_OPTION) ??
  Object.keys(rxListSortingOptions)[0];

export const allergyTypes = {
  OBSERVED:
    'Observed (you experienced this allergy or reaction while you were getting care at this VA location)',
  REPORTED:
    'Historical (you experienced this allergy or reaction in the past, before you started getting care at this VA location)',
};

export const FIELD_NONE_NOTED = 'None noted';
export const FIELD_NOT_AVAILABLE = 'Not available';
export const NO_PROVIDER_NAME = 'Provider name not available';

export const downtimeNotificationParams = {
  appTitle: 'this medications tool',
};

export const trackingConfig = {
  dhl: {
    label: 'DHL',
    url: 'http://webtrack.dhlglobalmail.com/?id=462&trackingnumber=',
  },
  fedex: {
    label: 'FedEx',
    url: 'https://www.fedex.com/fedextrack/?trknbr=',
  },
  ups: {
    label: 'UPS',
    url:
      'http://wwwapps.ups.com/WebTracking/processInputRequest?HTMLVersion=5.0&loc=en_US&Requester=UPSHome&tracknum=',
  },
  usps: {
    label: 'USPS',
    url: 'https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=',
  },
};

export const tooltipNames = {
  mhvMedicationsTooltipFilterAccordion:
    'mhv_medications_tooltip_filter_accordion',
};

export const tooltipHintContent = {
  filterAccordion: {
    HINT: 'Filter your list to find a specific medication.',
  },
};

export const recordNotFoundMessage = 'Record not found';
