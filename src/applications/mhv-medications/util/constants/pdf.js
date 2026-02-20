// Legacy status definitions for PDF (VistA/MHV)
export const pdfStatusDefinitions = {
  active: [
    {
      value: `This is a current prescription. If you have refills left, you can request a refill now. If you have no refills left, you’ll need to request a renewal instead.`,
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

// New VA.gov status definitions for PDF (OH)
export const pdfStatusDefinitionsV2 = {
  active: [
    {
      value: `A prescription you can fill at a local VA pharmacy. If this prescription is refillable, you may request a refill.`,
    },
    {
      value: `If you need a medication immediately, call your VA pharmacy’s automated refill line. You can find the pharmacy phone number on your prescription label or in your medications details page.`,
    },
  ],
  inprogress: [
    {
      value: `A new prescription or a prescription you’ve requested a refill or renewal for.`,
    },
    {
      value: `If you need your medication sooner, call your VA pharmacy’s automated refill line. You can find the pharmacy phone number on your prescription label or in your medications details page.`,
    },
  ],
  inactive: [
    {
      value: `A prescription you can no longer fill. Contact your VA provider if you need more of this medication.`,
    },
  ],
  transferred: [
    {
      value: `A prescription moved to VA’s new electronic health record. This prescription may also be described as “Discontinued” on medication lists from your health care team. Take your medications as prescribed by your health care team.`,
    },
  ],
  statusNotAvailable: [
    {
      value: `There’s a problem with our system. You can’t manage this prescription online right now.`,
    },
    {
      value: `If you need this prescription now, call your VA pharmacy.`,
    },
  ],
};

export const pdfDefaultStatusDefinition = [
  {
    value: `We can’t access information about this prescription right now.`,
  },
];

export const pdfDefaultPendingMedDefinition =
  'This is a new prescription from your provider. Your VA pharmacy is reviewing it now. Details may change.';

export const pdfDefaultPendingRenewalDefinition =
  'This is a renewal you requested. Your VA pharmacy is reviewing it now. Details may change.';

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

export const medStatusDisplayTypes = {
  VA_PRESCRIPTION: 'VaPrescription',
  PRINT: 'print',
  TXT: 'txt',
};
