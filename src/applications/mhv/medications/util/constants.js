export const rxListSortingOptions = {
  lastFilledFirst: {
    API_ENDPOINT: '&sort[]=-dispensed_date&sort[]=prescription_name',
    LABEL: 'Last filled first',
  },
  alphabeticallyByStatus: {
    API_ENDPOINT:
      '&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date',
    LABEL: 'Alphabetically by status',
  },
  alphabeticalOrder: {
    API_ENDPOINT: '&sort[]=prescription_name&sort[]=dispensed_date',
    LABEL: 'Alphabetically by name',
  },
};

export const medicationsUrls = {
  MEDICATIONS_URL: '/my-health/medications',
  MEDICATIONS_LOGIN: '/my-health/medications?next=loginModal&oauth=true',
  MEDICATIONS_ABOUT: '/my-health/medications/about',
  MEDICATIONS_REFILL: '/my-health/medications/refill',
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
      value: `This is a current prescription. If you have refills left, you can request a refill now.`,
    },
    {
      continued: true,
      value: `Note: `,
      weight: 'bold',
    },
    {
      value: `If you have no refills left, you’ll need to request a renewal instead.`,
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
    value: `There’s a problem with our system. You can’t manage this prescription online right now.`,
  },
  {
    value: `If you need this prescription now, call your VA pharmacy.`,
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

export const INCLUDE_IMAGE_ENDPOINT = '&include_image=true';

export const PDF_TXT_GENERATE_STATUS = {
  NotStarted: 'PDF_GENERATE_NOT_STARTED',
  InProgress: 'PDF_GENERATE_IN_PROGRESS',
  Success: 'PDF_GENERATE_SUCESS',
};

export const defaultSelectedSortOption =
  sessionStorage.getItem(SESSION_SELECTED_SORT_OPTION) ??
  Object.keys(rxListSortingOptions)[0];
