// Helpers
const createClaimPhaseDates = (claimDate, phaseType, previousPhases = {}) => ({
  phaseChangeDate: claimDate,
  currentPhaseBack: false,
  phaseType,
  latestPhaseType: phaseType,
  previousPhases,
});

const createEvent = (date, type) => ({
  date,
  type,
});

const createIssue = (description, diagnosticCode, date, lastAction) => ({
  active: true,
  description,
  diagnosticCode,
  lastAction,
  date,
});

const createEvidence = (date, description, type = 'VA_FORM') => ({
  date,
  description,
  type,
});

const createSupportingDocument = (
  documentId,
  type,
  fileName,
  trackedItemId,
  uploadDate,
) => ({
  documentId,
  documentTypeLabel: type,
  originalFileName: fileName,
  trackedItemId,
  uploadDate,
});

const createEvidenceSubmission = (
  id,
  claimId,
  {
    acknowledgementDate,
    createdAt,
    deleteDate = null,
    documentType,
    failedDate,
    fileName,
    lighthouseUpload = true,
    trackedItemId = null,
    trackedItemDisplayName = null,
    uploadStatus = 'FAILED',
    vaNotifyStatus = 'SENT',
  },
) => ({
  acknowledgementDate,
  id,
  claimId,
  createdAt,
  deleteDate,
  documentType,
  failedDate,
  fileName,
  lighthouseUpload,
  trackedItemId,
  trackedItemDisplayName,
  uploadStatus,
  vaNotifyStatus,
});

const createClaim = (
  id,
  {
    baseEndProductCode,
    claimDate,
    phaseType,
    claimType,
    claimTypeCode,
    endProductCode,
    status,
    closeDate,
    documentsNeeded = false,
    developmentLetterSent = false,
    decisionLetterSent = false,
    evidenceWaiverSubmitted5103 = false,
    hasFailedUploads = false,
    issues = [],
    evidence = [],
    supportingDocuments = [],
    evidenceSubmissions = [],
    contentions = [],
    previousPhases = {},
    trackedItems = null,
  },
  withTrackedItems = true,
) => ({
  data: {
    id,
    type: 'claim',
    attributes: {
      baseEndProductCode,
      claimDate,
      claimPhaseDates: createClaimPhaseDates(
        claimDate,
        phaseType,
        previousPhases,
      ),
      claimType,
      claimTypeCode,
      closeDate,
      decisionLetterSent,
      developmentLetterSent,
      documentsNeeded,
      endProductCode,
      evidenceWaiverSubmitted5103,
      lighthouseId: null,
      status,
      hasFailedUploads,
      supportingDocuments,
      evidenceSubmissions,
      contentions,
      events: [
        createEvent(claimDate, 'CLAIM_RECEIVED'),
        ...(phaseType !== 'CLAIM_RECEIVED'
          ? [createEvent(claimDate, phaseType)]
          : []),
      ],
      issues,
      evidence,
      trackedItems:
        trackedItems ||
        (withTrackedItems
          ? [
              {
                id: 1,
                displayName: '21-4142/21-4142a',
                status: 'NEEDED_FROM_YOU',
                suspenseDate: '2024-12-01',
                type: 'other',
              },
              {
                id: 2,
                displayName: 'Private medical records',
                status: 'NEEDED_FROM_OTHERS',
                suspenseDate: '2024-12-10',
                type: 'other',
              },
            ]
          : []),
    },
  },
});

const appealData1 = {
  id: 'SC10755',
  type: 'supplementalClaim',
  attributes: {
    appealIds: ['SC10755'],
    updated: '2025-06-27T10:48:58-04:00',
    incompleteHistory: false,
    active: true,
    description:
      'Service connection for Hypertension, essential is granted with an evaluation of 0 percent effective October 1, 2022. and 3 others',
    location: 'aoj',
    aoj: 'vba',
    programArea: 'compensation',
    status: {
      type: 'sc_recieved',
      details: {},
    },
    alerts: [],
    issues: [
      {
        active: true,
        lastAction: null,
        date: null,
        description:
          'Other Non-Rated - this is the issue description I typed when I added the issue',
        diagnosticCode: null,
      },
      {
        active: true,
        lastAction: null,
        date: null,
        description: 'Post traumatic stress disorder (PTSD) is granted.',
        diagnosticCode: '9411',
      },
      {
        active: true,
        lastAction: null,
        date: '2024-10-25',
        description: null,
        diagnosticCode: '9411',
      },
    ],
    events: [
      {
        type: 'sc_request',
        date: '2024-10-25',
      },
    ],
    evidence: [],
    evidenceSubmissions: [
      createEvidenceSubmission(300, 'SC10755', {
        acknowledgementDate: new Date(
          Date.now() + 27 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        documentType: 'Appeal Supporting Documents',
        failedDate: new Date(
          Date.now() - 3 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        fileName: 'appeal-supporting-documents.pdf',
      }),
    ],
  },
};

const appealData = {
  data: [
    appealData1,
    {
      id: '2765759',
      type: 'legacyAppeal',
      attributes: {
        appealIds: ['2765759'],
        updated: '2021-03-04T19:55:21-05:00',
        incompleteHistory: false,
        type: 'original',
        // this determines if the appeal is open or closed
        active: true,
        description: 'Benefits as a result of VA error (Section 1151)',
        aod: false,
        location: 'bva',
        aoj: 'vba',
        programArea: 'compensation',
        status: { type: 'on_docket', details: {} },
        alerts: [],
        docket: {
          front: false,
          total: 140135,
          ahead: 101381,
          ready: 16432,
          month: '2012-04-01',
          docketMonth: '2011-01-01',
          eta: null,
        },
        issues: [
          {
            description: 'Benefits as a result of VA error (Section 1151)',
            diagnosticCode: null,
            active: true,
            lastAction: 'withdrawn',
            date: new Date().toISOString(),
          },
          {
            description: null,
            diagnosticCode: null,
            active: false,
            lastAction: 'withdrawn',
            date: new Date().toISOString(),
          },
          {
            description: null,
            diagnosticCode: null,
            active: false,
            lastAction: null,
            date: null,
          },
          {
            description: null,
            diagnosticCode: null,
            active: false,
            lastAction: null,
            date: null,
          },
          {
            description: 'Benefits as a result of VA error (Section 1151)',
            diagnosticCode: null,
            active: false,
            lastAction: null,
            date: null,
          },
        ],
        events: [
          { type: 'nod', date: '2012-02-02' },
          { type: 'soc', date: '2012-03-03' },
          { type: 'form9', date: '2012-04-04' },
          { type: 'hearing_held', date: '2023-01-11' },
        ],
        evidence: [],
      },
    },
    {
      id: 'HLR4196',
      type: 'higherLevelReview',
      attributes: {
        appealIds: ['HLR4196'],
        updated: '2025-09-26T10:48:46-04:00',
        incompleteHistory: false,
        active: true,
        description: '1 medical issue and 1 non-rated issue',
        location: 'aoj',
        aoj: 'vha',
        programArea: 'medical',
        status: {
          type: 'hlr_received',
          details: {},
        },
        alerts: [],
        issues: [
          {
            active: true,
            lastAction: null,
            date: null,
            description: 'Beneficiary Travel - This is a test',
            diagnosticCode: null,
          },
          {
            active: true,
            lastAction: null,
            date: null,
            description: null,
            diagnosticCode: null,
          },
          {
            active: true,
            lastAction: null,
            date: null,
            description: null,
            diagnosticCode: null,
          },
        ],
        events: [
          {
            type: 'hlr_request',
            date: '2023-01-11',
          },
        ],
        evidence: [],
      },
    },
  ],
};

const baseClaims = [
  // closedClaimAlert
  createClaim('1', {
    baseEndProductCode: '120',
    claimDate: '2024-10-12',
    phaseType: 'COMPLETE',
    claimType: 'Pension',
    claimTypeCode: '120ILCP7PMC',
    endProductCode: '121',
    status: 'COMPLETE',
    closeDate: '2024-10-16',
    decisionLetterSent: true,
    developmentLetterSent: true,
    documentsNeeded: false,
    evidenceWaiverSubmitted5103: true,
    issues: [createIssue('Pension claim', null, '2024-10-12', '2024-10-16')],
    evidence: [
      createEvidence(
        '2024-10-12',
        'VA Form 21P-527EZ, Application for Pension',
      ),
    ],
    supportingDocuments: [
      createSupportingDocument(
        '{A8A7A709-E3FD-44FA-99C9-C3B772AD0202}',
        'Photographs',
        'pension_evidence.pdf',
        529617,
        '2024-10-16',
      ),
      createSupportingDocument(
        '{9baad655-ab8d-4bfa-b78c-58675dfc6897}',
        '5103 Notice Acknowledgement',
        'Jon_Doe_1_5103.pdf',
        null,
        '2024-10-16',
      ),
    ],
    contentions: [
      {
        name: 'Pension claim',
      },
    ],
  }),
  // Ask va to decide. `/track-claims/your-claims/2/ask-va-to-decide`
  createClaim('2', {
    baseEndProductCode: '020',
    claimDate: '2024-11-01',
    phaseType: 'GATHERING_OF_EVIDENCE',
    claimType: 'Compensation',
    claimTypeCode: '020CPHLP',
    endProductCode: '022',
    status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
    closeDate: null,
    documentsNeeded: false,
    developmentLetterSent: true,
    evidenceWaiverSubmitted5103: false, // <-- key!
    issues: [
      createIssue(
        'Service connection for PTSD',
        '9411',
        '2024-11-01',
        '2024-11-05',
      ),
      createIssue(
        'Service connection for tinnitus',
        '6260',
        '2024-11-01',
        '2024-11-05',
      ),
    ],
    evidence: [
      createEvidence(
        '2024-11-01',
        'VA Form 21-526EZ, Application for Disability Compensation and Related Compensation Benefits',
      ),
      createEvidence(
        '2024-11-05',
        'VA Form 21-4142, Authorization to Disclose Information to the Department of Veterans Affairs',
      ),
    ],
    evidenceSubmissions: [
      createEvidenceSubmission(111, 8, {
        acknowledgementDate: new Date(
          Date.now() + 25 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        documentType: 'VA Form 21-686c - Declaration of Status of Dependents',
        failedDate: new Date(
          Date.now() - 5 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        fileName: '686c-declaration-of-status-of-dependents.pdf',
      }),
    ],
    contentions: [
      { name: 'Service connection for PTSD' },
      { name: 'Service connection for tinnitus' },
    ],
  }),
  // Standard 5 step claim process w/ slim alert.
  createClaim('3', {
    baseEndProductCode: '020',
    claimDate: '2024-10-11',
    phaseType: 'GATHERING_OF_EVIDENCE', // 5-step process uses phaseType
    claimType: 'Compensation',
    claimTypeCode: '020CPHLP', // 5-step process code
    endProductCode: '022',
    status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
    closeDate: null,
    documentsNeeded: true,
    developmentLetterSent: true,
    evidenceWaiverSubmitted5103: true,
    issues: [
      createIssue(
        'Service connection for PTSD',
        '9411',
        '2024-10-11',
        '2024-10-16',
      ),
      createIssue(
        'Service connection for tinnitus',
        '6260',
        '2024-10-11',
        '2024-10-16',
      ),
    ],
    evidence: [
      createEvidence(
        '2024-10-11',
        'VA Form 21-526EZ, Application for Disability Compensation and Related Compensation Benefits',
      ),
      createEvidence(
        '2024-10-16',
        'VA Form 21-4142, Authorization to Disclose Information to the Department of Veterans Affairs',
      ),
    ],
    evidenceSubmissions: [
      createEvidenceSubmission(111, 8, {
        acknowledgementDate: new Date(
          Date.now() + 25 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        documentType: 'VA Form 21-686c - Declaration of Status of Dependents',
        failedDate: new Date(
          Date.now() - 5 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        fileName: '686c-declaration-of-status-of-dependents.pdf',
      }),
    ],
    supportingDocuments: [
      createSupportingDocument(
        '{A8A7A709-E3FD-44FA-99C9-C3B772AD0201}',
        'Photographs',
        'A050609E-81CD-4959-BD89-0D15529CDC42.pdf',
        529615,
        '2024-10-16',
      ),
      createSupportingDocument(
        '{9baad655-ab8d-4bfa-b78c-58675dfc6896}',
        '5103 Notice Acknowledgement',
        'Jon_Doe_600571685_5103.pdf',
        null,
        '2024-10-16',
      ),
      createSupportingDocument(
        '{89f6cf4a-6862-4a45-99cd-d36b86970b90}',
        'Military Personnel Record',
        'Claims_optimization.pdf',
        529616,
        '2025-05-27',
      ),
    ],
    contentions: [], // empty contentions force the slim alert on the claim status page
  }),
  // 8 step disability compensation claim process
  createClaim('4', {
    baseEndProductCode: '020',
    claimDate: '2024-10-10',
    phaseType: 'GATHERING_OF_EVIDENCE',
    claimType: 'Compensation',
    claimTypeCode: '020SMB', // must be a valid disability claimTypeCode
    status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
    closeDate: null,
    documentsNeeded: false,
    developmentLetterSent: true,
    evidenceWaiverSubmitted5103: true,
    issues: [
      createIssue(
        'Service connection for PTSD',
        '9411',
        '2024-10-10',
        '2024-10-15',
      ),
      createIssue(
        'Service connection for tinnitus',
        '6260',
        '2024-10-10',
        '2024-10-15',
      ),
    ],
    evidence: [
      createEvidence(
        '2024-10-10',
        'VA Form 21-526EZ, Application for Disability Compensation and Related Compensation Benefits',
      ),
      createEvidence(
        '2024-10-15',
        'VA Form 21-4142, Authorization to Disclose Information to the Department of Veterans Affairs',
      ),
    ],
    supportingDocuments: [
      createSupportingDocument(
        '{A8A7A709-E3FD-44FA-99C9-C3B772AD0200}',
        'Photographs',
        'A050609E-81CD-4959-BD89-0D15529CDC41.pdf',
        529614,
        '2024-10-15',
      ),
      createSupportingDocument(
        '{9baad655-ab8d-4bfa-b78c-58675dfc6895}',
        '5103 Notice Acknowledgement',
        'Johnnie_Weave_4_5103.pdf',
        null,
        '2024-10-15',
      ),
      createSupportingDocument(
        '{89f6cf4a-6862-4a45-99cd-d36b86970b89}',
        'Military Personnel Record',
        'Claims_optimization.pdf',
        529613,
        '2025-05-26',
      ),
    ],
    contentions: [
      {
        name: 'Service connection for PTSD',
      },
      {
        name: 'Service connection for tinnitus',
      },
    ],
  }),
  // Claim with no tracked items, no supporting documents, and no evidence submissions
  createClaim(
    '5',
    {
      baseEndProductCode: '020',
      claimDate: '2024-10-09',
      phaseType: 'GATHERING_OF_EVIDENCE',
      claimType: 'Compensation',
      claimTypeCode: '020CPHLP',
      status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
      closeDate: null,
      documentsNeeded: false,
      developmentLetterSent: true,
      evidenceWaiverSubmitted5103: true,
      issues: [],
      evidence: [],
      evidenceSubmissions: [],
      supportingDocuments: [],
      contentions: [
        {
          name: 'Service connection for tinnitus',
        },
      ],
    },
    false,
  ),
  // Claim with no tracked items, no supporting documents, and 1 IN_PROGRESS evidence submission queued for lighthouse upload
  createClaim(
    '6',
    {
      baseEndProductCode: '020',
      claimDate: '2024-10-09',
      phaseType: 'GATHERING_OF_EVIDENCE',
      claimType: 'Compensation',
      claimTypeCode: '020CPHLP',
      status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
      closeDate: null,
      documentsNeeded: false,
      developmentLetterSent: true,
      evidenceWaiverSubmitted5103: true,
      issues: [],
      evidence: [],
      evidenceSubmissions: [
        createEvidenceSubmission(189, 6, {
          acknowledgementDate: null,
          createdAt: '2025-07-16T20:15:54.461Z',
          deleteDate: '2025-09-14T21:00:00.847Z',
          documentType: 'Birth Certificate',
          failedDate: null,
          fileName: 'Birth Certificate.pdf',
          uploadStatus: 'QUEUED',
          vaNotifyStatus: null,
        }),
      ],
      supportingDocuments: [],
      contentions: [
        {
          name: 'Service connection for tinnitus',
        },
      ],
    },
    false,
  ),
  // Claim with no tracked items, 1 successfully uploaded supporting document, and no in progress evidence submissions
  createClaim(
    '7',
    {
      baseEndProductCode: '020',
      claimDate: '2024-10-09',
      phaseType: 'GATHERING_OF_EVIDENCE',
      claimType: 'Compensation',
      claimTypeCode: '020CPHLP',
      status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
      closeDate: null,
      documentsNeeded: false,
      developmentLetterSent: true,
      evidenceWaiverSubmitted5103: true,
      issues: [],
      evidence: [],
      evidenceSubmissions: [],
      supportingDocuments: [
        createSupportingDocument(
          '{A8A7A709-E3FD-44FA-99C9-C3B772AD0200}',
          'Photographs',
          'Not tracked item photos.pdf',
          null,
          '2024-10-15',
        ),
      ],
      contentions: [
        {
          name: 'Service connection for tinnitus',
        },
      ],
    },
    false,
  ),
  // Claim with no tracked items, 1 successfully uploaded supporting document, and 1 in progress evidence submission
  createClaim(
    '8',
    {
      baseEndProductCode: '020',
      claimDate: '2024-10-09',
      phaseType: 'GATHERING_OF_EVIDENCE',
      claimType: 'Compensation',
      claimTypeCode: '020CPHLP',
      status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
      closeDate: null,
      documentsNeeded: false,
      developmentLetterSent: true,
      evidenceWaiverSubmitted5103: true,
      issues: [],
      evidence: [],
      evidenceSubmissions: [
        createEvidenceSubmission(189, 6, {
          acknowledgementDate: null,
          createdAt: '2025-07-16T20:15:54.461Z',
          deleteDate: '2025-09-14T21:00:00.847Z',
          documentType: 'Birth Certificate',
          failedDate: null,
          fileName: 'Birth Certificate.pdf',
          uploadStatus: 'QUEUED',
          vaNotifyStatus: null,
        }),
        createEvidenceSubmission(132, 8, {
          acknowledgementDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          createdAt: new Date(
            Date.now() - 3 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          documentType:
            'VA Form 21-4142 - Authorization To Disclose Information',
          failedDate: new Date().toISOString(),
          fileName: 'authorization-form-signed.pdf',
          trackedItemId: 3,
          trackedItemDisplayName: '21-4142',
        }),
        createEvidenceSubmission(111, 8, {
          acknowledgementDate: new Date(
            Date.now() + 25 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          createdAt: new Date(
            Date.now() - 3 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          documentType: 'VA Form 21-686c - Declaration of Status of Dependents',
          failedDate: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          fileName: '686c-declaration-of-status-of-dependents.pdf',
        }),
        createEvidenceSubmission(115, 8, {
          acknowledgementDate: new Date(
            Date.now() + 27 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          createdAt: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          documentType:
            'VA Form 21-4502 - Application for Automobile or Other Conveyance and Adaptive Equipment Under 38 U.S.C. 3901-3904',
          failedDate: new Date(
            Date.now() - 3 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          fileName: 'my-car-claim-form-2.pdf',
        }),
      ],
      supportingDocuments: [
        createSupportingDocument(
          '{A8A7A709-E3FD-44FA-99C9-C3B772AD0200}',
          'Photographs',
          'Not tracked item photos.pdf',
          null,
          '2024-10-15',
        ),
      ],
      contentions: [
        {
          name: 'Service connection for tinnitus',
        },
      ],
    },
    false,
  ),
  // Claim to exercise FilesReceived component
  createClaim('9', {
    baseEndProductCode: '020',
    claimDate: '2024-10-09',
    phaseType: 'GATHERING_OF_EVIDENCE',
    claimType: 'Compensation',
    claimTypeCode: '020CPHLP',
    status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
    closeDate: null,
    documentsNeeded: false,
    developmentLetterSent: true,
    evidenceWaiverSubmitted5103: true,
    issues: [],
    evidence: [],
    evidenceSubmissions: [],
    supportingDocuments: [
      // Documents with trackedItemId=null will show "No review status available"
      createSupportingDocument(
        '{A8A7A709-E3FD-44FA-99C9-C3B772AD0200}',
        'Photographs',
        'additional_evidence_photo_1.pdf',
        null,
        '2025-09-28',
      ),
      createSupportingDocument(
        '{A8A7A709-E3FD-44FA-99C9-C3B772AD0201}',
        'Birth Certificate',
        'additional_evidence_birth_cert.pdf',
        null,
        '2025-09-27',
      ),
      createSupportingDocument(
        '{A8A7A709-E3FD-44FA-99C9-C3B772AD0202}',
        'Medical Record',
        'additional_evidence_medical.pdf',
        null,
        '2025-09-26',
      ),
      createSupportingDocument(
        '{A8A7A709-E3FD-44FA-99C9-C3B772AD0203}',
        'DD214',
        'additional_evidence_dd214.pdf',
        null,
        '2025-09-25',
      ),
      // Documents for tracked item 101 - "Reviewed by VA"
      createSupportingDocument(
        '{DOC-101-1}',
        'Medical Treatment Records',
        'hospital_a_records.pdf',
        101,
        '2025-09-24',
      ),
      // Documents for tracked item 102 - "Reviewed by VA" (ACCEPTED)
      createSupportingDocument(
        '{DOC-102-1}',
        'Military Personnel Record',
        'service_records.pdf',
        102,
        '2025-09-23',
      ),
      // Documents for tracked item 103 - "Pending review"
      createSupportingDocument(
        '{DOC-103-1}',
        'Medical Treatment Records',
        'private_clinic_records.pdf',
        103,
        '2025-09-22',
      ),
      createSupportingDocument(
        '{DOC-103-2}',
        'Medical Treatment Records',
        'doctor_notes.pdf',
        103,
        '2025-09-22',
      ),
      // Documents for tracked item 104 - "No longer needed"
      createSupportingDocument(
        '{DOC-104-1}',
        'Buddy/Lay Statement',
        'buddy_statement.pdf',
        104,
        '2025-09-21',
      ),
      // Documents for tracked item 105 - "Pending review"
      createSupportingDocument(
        '{DOC-105-1}',
        'Dental Records',
        'dental_xrays.pdf',
        105,
        '2025-09-20',
      ),
      // Documents for tracked item 106 - "Reviewed by VA"
      createSupportingDocument(
        '{DOC-106-1}',
        'Medical Records',
        'lab_results_2024.pdf',
        106,
        '2025-09-19',
      ),
      // Documents for tracked item 107 - "Reviewed by VA" (ACCEPTED)
      createSupportingDocument(
        '{DOC-107-1}',
        'VA Form 21-0781',
        'ptsd_statement.pdf',
        107,
        '2025-09-17',
      ),
      // Documents for tracked item 108 - "Pending review"
      createSupportingDocument(
        '{DOC-108-1}',
        'Medical Records',
        'therapy_records.pdf',
        108,
        '2025-09-16',
      ),
    ],
    // Tracked items WITHOUT embedded documents (serializer will add them)
    trackedItems: [
      // Tracked item with NO documents - will show "File name unknown"
      {
        id: 109,
        displayName: 'Employment records',
        status: 'INITIAL_REVIEW_COMPLETE',
        receivedDate: '2025-09-30',
        closedDate: null,
        suspenseDate: '2024-12-15',
        type: 'still_need_from_you_list',
      },
      // Status: "Reviewed by VA"
      {
        id: 101,
        displayName: 'Medical records - Hospital A',
        status: 'INITIAL_REVIEW_COMPLETE',
        receivedDate: '2025-09-24',
        closedDate: null,
        suspenseDate: '2024-12-01',
        type: 'still_need_from_you_list',
      },
      // Status: "Reviewed by VA" (ACCEPTED)
      {
        id: 102,
        displayName: 'Service Personnel Records',
        status: 'ACCEPTED',
        receivedDate: '2025-09-23',
        closedDate: null,
        suspenseDate: '2024-12-01',
        type: 'still_need_from_you_list',
      },
      // Status: "Pending review"
      {
        id: 103,
        displayName: 'Private medical records',
        status: 'SUBMITTED_AWAITING_REVIEW',
        receivedDate: null,
        closedDate: null,
        suspenseDate: '2024-12-10',
        type: 'still_need_from_you_list',
      },
      // Status: "No longer needed"
      {
        id: 104,
        displayName: 'Buddy statement',
        status: 'NO_LONGER_REQUIRED',
        receivedDate: null,
        closedDate: '2025-09-21',
        suspenseDate: '2024-12-15',
        type: 'still_need_from_you_list',
      },
      // Another "Pending review"
      {
        id: 105,
        displayName: 'Dental records',
        status: 'SUBMITTED_AWAITING_REVIEW',
        receivedDate: null,
        closedDate: null,
        suspenseDate: '2024-12-20',
        type: 'still_need_from_you_list',
      },
      // Another "Reviewed by VA"
      {
        id: 106,
        displayName: 'Lab results',
        status: 'INITIAL_REVIEW_COMPLETE',
        receivedDate: '2025-09-19',
        closedDate: null,
        suspenseDate: '2024-12-25',
        type: 'still_need_from_you_list',
      },
      // Another "Reviewed by VA" (ACCEPTED)
      {
        id: 107,
        displayName: 'PTSD Statement',
        status: 'ACCEPTED',
        receivedDate: '2025-09-17',
        closedDate: null,
        suspenseDate: '2024-12-28',
        type: 'still_need_from_you_list',
      },
      // Another "Pending review"
      {
        id: 108,
        displayName: 'Therapy records',
        status: 'SUBMITTED_AWAITING_REVIEW',
        receivedDate: null,
        closedDate: null,
        suspenseDate: '2024-12-30',
        type: 'still_need_from_you_list',
      },
    ],
    contentions: [
      {
        name: 'Service connection for tinnitus',
      },
    ],
  }),
  // Claim with 12 evidence submissions in progress to exercise FileSubmissionsInProgress component
  createClaim(
    '10',
    {
      baseEndProductCode: '020',
      claimDate: '2024-10-08',
      phaseType: 'GATHERING_OF_EVIDENCE',
      claimType: 'Compensation',
      claimTypeCode: '020CPHLP',
      status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
      closeDate: null,
      documentsNeeded: false,
      developmentLetterSent: true,
      evidenceWaiverSubmitted5103: true,
      issues: [],
      evidence: [],
      evidenceSubmissions: [
        createEvidenceSubmission(201, 10, {
          acknowledgementDate: null,
          createdAt: '2025-09-30T14:30:00.000Z',
          deleteDate: '2025-11-29T23:59:59.999Z',
          documentType: 'Medical Treatment Records',
          failedDate: null,
          fileName: 'hospital_records_2024.pdf',
          trackedItemId: 201,
          trackedItemDisplayName: 'Medical records from Hospital A',
          uploadStatus: 'QUEUED',
          vaNotifyStatus: null,
        }),
        createEvidenceSubmission(202, 10, {
          acknowledgementDate: null,
          createdAt: '2025-09-29T10:15:00.000Z',
          deleteDate: '2025-11-28T23:59:59.999Z',
          documentType: 'X-rays',
          failedDate: null,
          fileName: 'spine_xray_march_2024.pdf',
          uploadStatus: 'PROCESSING',
          vaNotifyStatus: null,
        }),
        createEvidenceSubmission(203, 10, {
          acknowledgementDate: null,
          createdAt: '2025-09-28T16:45:00.000Z',
          deleteDate: '2025-11-27T23:59:59.999Z',
          documentType: 'Buddy/Lay Statement',
          failedDate: null,
          fileName: 'buddy_statement_john_smith.pdf',
          uploadStatus: 'QUEUED',
          vaNotifyStatus: null,
        }),
        createEvidenceSubmission(204, 10, {
          acknowledgementDate: null,
          createdAt: '2025-09-27T09:20:00.000Z',
          deleteDate: '2025-11-26T23:59:59.999Z',
          documentType: 'VA Form 21-4142',
          failedDate: '2025-09-27T09:25:00.000Z',
          fileName: 'authorization_form.pdf',
          trackedItemId: 202,
          trackedItemDisplayName: 'Authorization to release medical records',
          uploadStatus: 'FAILED',
          vaNotifyStatus: null,
        }),
        createEvidenceSubmission(205, 10, {
          acknowledgementDate: null,
          createdAt: '2025-09-26T13:10:00.000Z',
          deleteDate: '2025-11-25T23:59:59.999Z',
          documentType: 'Dental Records',
          failedDate: null,
          fileName: 'dental_exam_2023.pdf',
          uploadStatus: 'PROCESSING',
          vaNotifyStatus: null,
        }),
        createEvidenceSubmission(206, 10, {
          acknowledgementDate: null,
          createdAt: '2025-09-25T11:00:00.000Z',
          deleteDate: '2025-11-24T23:59:59.999Z',
          documentType: 'Military Personnel Record',
          failedDate: null,
          fileName: 'service_records_1990_2010.pdf',
          trackedItemId: 203,
          trackedItemDisplayName: 'Military service records',
          uploadStatus: 'QUEUED',
          vaNotifyStatus: null,
        }),
        createEvidenceSubmission(207, 10, {
          acknowledgementDate: null,
          createdAt: '2025-09-24T08:30:00.000Z',
          deleteDate: '2025-11-23T23:59:59.999Z',
          documentType: 'Photographs',
          failedDate: null,
          fileName: 'injury_photos_leg.jpg',
          uploadStatus: 'QUEUED',
          vaNotifyStatus: null,
        }),
        createEvidenceSubmission(208, 10, {
          acknowledgementDate: null,
          createdAt: '2025-09-23T15:45:00.000Z',
          deleteDate: '2025-11-22T23:59:59.999Z',
          documentType: 'Medical Treatment Records',
          failedDate: null,
          fileName: 'private_clinic_notes_2024.pdf',
          trackedItemId: 204,
          trackedItemDisplayName: 'Private clinic treatment records',
          uploadStatus: 'PROCESSING',
          vaNotifyStatus: null,
        }),
        createEvidenceSubmission(209, 10, {
          acknowledgementDate: null,
          createdAt: '2025-09-22T12:20:00.000Z',
          deleteDate: '2025-11-21T23:59:59.999Z',
          documentType: 'Correspondence',
          failedDate: null,
          fileName: 'doctor_letter_disability.pdf',
          uploadStatus: 'QUEUED',
          vaNotifyStatus: null,
        }),
        createEvidenceSubmission(210, 10, {
          acknowledgementDate: null,
          createdAt: '2025-09-21T10:05:00.000Z',
          deleteDate: '2025-11-20T23:59:59.999Z',
          documentType: 'VA Form 21-0781',
          failedDate: null,
          fileName: 'ptsd_statement_form.pdf',
          trackedItemId: 205,
          trackedItemDisplayName: 'PTSD personal statement',
          uploadStatus: 'QUEUED',
          vaNotifyStatus: null,
        }),
        createEvidenceSubmission(211, 10, {
          acknowledgementDate: null,
          createdAt: '2025-09-20T14:50:00.000Z',
          deleteDate: '2025-11-19T23:59:59.999Z',
          documentType: 'Lab Results',
          failedDate: null,
          fileName: 'blood_test_results_june_2024.pdf',
          uploadStatus: 'PROCESSING',
          vaNotifyStatus: null,
        }),
        createEvidenceSubmission(212, 10, {
          acknowledgementDate: null,
          createdAt: '2025-09-19T09:15:00.000Z',
          deleteDate: '2025-11-18T23:59:59.999Z',
          documentType: 'Prescription Records',
          failedDate: null,
          fileName: 'pharmacy_records_2024.pdf',
          uploadStatus: 'QUEUED',
          vaNotifyStatus: null,
        }),
      ],
      supportingDocuments: [],
      contentions: [
        {
          name: 'Service connection for back injury',
        },
        {
          name: 'Service connection for PTSD',
        },
      ],
    },
    false,
  ),

  // STEM Scholarship claim for StemClaimListItem component
  {
    data: {
      id: '11',
      type: 'education_benefits_claims',
      attributes: {
        confirmationNumber: 'V-EBC-11',
        isEnrolledStem: true,
        isPursuingTeachingCert: false,
        benefitLeft: 'moreThanSixMonths',
        remainingEntitlement: null,
        automatedDenial: true,
        deniedAt: '2024-10-15T15:08:20.489Z',
        submittedAt: '2024-09-15T15:08:20.489Z',
        evidenceSubmissions: [
          createEvidenceSubmission(232, 11, {
            acknowledgementDate: new Date(
              Date.now() + 20 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            createdAt: new Date(
              Date.now() - 10 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            documentType: 'STEM Scholarship Supporting Documents',
            failedDate: new Date(
              Date.now() - 10 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            fileName: 'stem-scholarship-documents.pdf',
          }),
        ],
      },
    },
  },
];

function getClaimDataById(id) {
  const claim = baseClaims.find(c => c.data.id === id);
  return claim || null;
}

function getClaimSummary(claim) {
  return claim.data;
}

function generateMockClaims(count, startId = 100) {
  const claims = [];
  for (let i = 0; i < count; i++) {
    const id = (startId + i).toString();
    claims.push(
      createClaim(id, {
        baseEndProductCode: '020',
        claimDate: `2024-10-${(i % 28) + 1}`,
        phaseType: 'GATHERING_OF_EVIDENCE',
        claimType: 'Compensation',
        claimTypeCode: '020CPHLP',
        endProductCode: '022',
        status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
        closeDate: null,
        documentsNeeded: false,
        developmentLetterSent: true,
        evidenceWaiverSubmitted5103: true,
        issues: [
          createIssue(
            `Service connection for test issue ${i + 1}`,
            '9411',
            `2024-10-${(i % 28) + 1}`,
            `2024-10-${(i % 28) + 2}`,
          ),
        ],
        evidence: [
          createEvidence(
            `2024-10-${(i % 28) + 1}`,
            'VA Form 21-526EZ, Application for Disability Compensation and Related Compensation Benefits',
          ),
        ],
        supportingDocuments: [],
        contentions: [{ name: `Test contention ${i + 1}` }],
      }),
    );
  }
  return claims;
}

// Toggle this flag to switch between just baseClaims or baseClaims + manyClaims
const USE_MANY_CLAIMS = true;

const claimsToUse = (() => {
  if (USE_MANY_CLAIMS) {
    const manyClaims = generateMockClaims(30);
    return baseClaims.concat(manyClaims);
  }
  return baseClaims;
})();

// Responses
const responses = {
  'GET /v0/user': {
    data: {
      id: '',
      type: 'user',
      attributes: {
        services: [
          'evss-claims',
          'lighthouse',
          'appeals-status',
          'user-profile',
          'vet360',
        ],
        userAccount: {
          id: 'fab317e4-5e2f-484a-9205-767001e28c3b',
        },
        account: {
          accountUuid: 'fab317e4-5e2f-484a-9205-767001e28c3b',
        },
        profile: {
          email: 'vets.gov.user+226@gmail.com',
          firstName: 'Jon',
          middleName: '',
          lastName: 'Doe',
          preferredName: null,
          birthDate: '1956-07-10',
          gender: 'M',
          zip: '94105-1804',
          lastSignedIn: '2025-06-16T17:51:36.872Z',
          loa: {
            current: 3,
            highest: 3,
          },
          multifactor: true,
          verified: true,
          signIn: {
            serviceName: 'idme',
            clientId: 'vaweb',
            authBroker: 'sis',
          },
          authnContext: 'http://idmanagement.gov/ns/assurance/loa/3',
          claims: {
            appeals: true,
            coe: true,
            communicationPreferences: true,
            connectedApps: true,
            medicalCopays: true,
            militaryHistory: true,
            paymentHistory: true,
            personalInformation: true,
            ratingInfo: true,
            form526RequiredIdentifierPresence: {
              participantId: true,
              birlsId: true,
              ssn: true,
              birthDate: true,
              edipi: true,
            },
          },
          icn: '1012740600V714187',
          birlsId: '796123607',
          edipi: '1005169255',
          secId: '0000028007',
          logingovUuid: null,
          idmeUuid: '1306e31273604dd4a12aa67609a63bfe',
          idTheftFlag: false,
          initialSignIn: '2022-04-22T19:23:16.193Z',
        },
        vaProfile: {
          status: 'OK',
          birthDate: '19560710',
          familyName: 'Doe',
          gender: 'M',
          givenNames: ['Jon', 'Doe'],
          isCernerPatient: false,
          cernerId: null,
          cernerFacilityIds: [],
          facilities: [],
          vaPatient: true,
          mhvAccountState: 'OK',
          activeMHVIds: ['14384899'],
        },
        veteranStatus: {
          status: 'OK',
          isVeteran: false,
          servedInMilitary: true,
        },
        inProgressForms: [],
        vet360ContactInformation: {
          vet360Id: '1133902',
          vaProfileId: '1133902',
        },
        session: {
          authBroker: 'sis',
          ssoe: false,
          transactionid: null,
        },
        onboarding: {
          show: null,
        },
      },
    },
    meta: {
      errors: null,
    },
  },

  'GET /v0/benefits_claims': {
    data: claimsToUse.map(getClaimSummary),
    meta: {
      pagination: {
        currentPage: 1,
        perPage: 10,
        totalPages: 3,
        totalEntries: 30,
      },
    },
  },

  'GET /v0/benefits_claims/failed_upload_evidence_submissions': {
    data: [
      {
        id: 1,
        acknowledgementDate: '2025-01-15T10:30:00.000Z',
        claimId: '1',
        createdAt: '2025-01-15T10:00:00.000Z',
        deleteDate: null,
        documentType:
          'VA Form 21-4142, Authorization for Release of Information',
        failedDate: '2025-01-15T10:35:00.000Z',
        fileName: 'new-VA-21-4142(1).pdf',
        lighthouseUpload: true,
        trackedItemId: 1,
        trackedItemDisplayName: '21-4142',
        uploadStatus: 'FAILED',
        vaNotifyStatus: 'SENT',
      },
      {
        id: 2,
        acknowledgementDate: '2025-01-22T10:30:00.000Z',
        claimId: '123456789',
        createdAt: '2025-01-22T10:00:00.000Z',
        deleteDate: null,
        documentType:
          'VA Form 21-4142, Authorization for Release of Information',
        failedDate: '2025-01-22T10:35:00.000Z',
        fileName: 'new-VA-21-4142(2).pdf',
        lighthouseUpload: true,
        trackedItemId: 1,
        trackedItemDisplayName: '21-4142',
        uploadStatus: 'FAILED',
        vaNotifyStatus: 'SENT',
      },
      {
        id: 3,
        acknowledgementDate: '2025-01-10T10:30:00.000Z',
        claimId: '123456789',
        createdAt: '2025-01-10T10:00:00.000Z',
        deleteDate: null,
        documentType:
          'VA Form 21-4142, Authorization for Release of Information',
        failedDate: '2025-01-10T10:35:00.000Z',
        fileName: 'new-VA-21-4142(3).pdf',
        lighthouseUpload: true,
        trackedItemId: 1,
        trackedItemDisplayName: '21-4142',
        uploadStatus: 'FAILED',
        vaNotifyStatus: 'SENT',
      },
      {
        id: 4,
        acknowledgementDate: '2025-01-20T14:20:00.000Z',
        claimId: '987654321',
        createdAt: '2025-01-20T14:00:00.000Z',
        deleteDate: null,
        documentType: 'Private Medical Records',
        failedDate: '2025-01-20T14:25:00.000Z',
        fileName: 'medical-records-dr-smith.pdf',
        lighthouseUpload: true,
        trackedItemId: 2,
        trackedItemDisplayName: 'Private medical records',
        uploadStatus: 'FAILED',
        vaNotifyStatus: 'SENT',
      },
      {
        id: 5,
        acknowledgementDate: '2025-01-05T09:15:00.000Z',
        claimId: '456789123',
        createdAt: '2025-01-05T09:00:00.000Z',
        deleteDate: null,
        documentType: 'Military Personnel Record',
        failedDate: '2025-01-05T09:20:00.000Z',
        fileName: 'dd214-discharge-papers.pdf',
        lighthouseUpload: true,
        trackedItemId: 3,
        trackedItemDisplayName: 'Military Personnel Record',
        uploadStatus: 'FAILED',
        vaNotifyStatus: 'SENT',
      },
      {
        id: 6,
        acknowledgementDate: '2025-01-18T16:45:00.000Z',
        claimId: '123456789',
        createdAt: '2025-01-18T16:30:00.000Z',
        deleteDate: null,
        documentType:
          'VA Form 21-526EZ, Application for Disability Compensation',
        failedDate: '2025-01-18T16:50:00.000Z',
        fileName: 'disability-claim-form.pdf',
        lighthouseUpload: true,
        trackedItemId: 4,
        trackedItemDisplayName: '21-526EZ',
        uploadStatus: 'FAILED',
        vaNotifyStatus: 'SENT',
      },
      {
        id: 7,
        acknowledgementDate: '2025-01-12T11:30:00.000Z',
        claimId: '789123456',
        createdAt: '2025-01-12T11:15:00.000Z',
        deleteDate: null,
        documentType: 'Photographs',
        failedDate: '2025-01-12T11:35:00.000Z',
        fileName: 'injury-photos.zip',
        lighthouseUpload: true,
        trackedItemId: 5,
        trackedItemDisplayName: 'Photographs',
        uploadStatus: 'FAILED',
        vaNotifyStatus: 'SENT',
      },
      {
        id: 8,
        acknowledgementDate: '2025-01-25T13:20:00.000Z',
        claimId: '321654987',
        createdAt: '2025-01-25T13:00:00.000Z',
        deleteDate: null,
        documentType:
          'VA Form 21-4142, Authorization for Release of Information',
        failedDate: '2025-01-25T13:25:00.000Z',
        fileName: 'authorization-form-signed.pdf',
        lighthouseUpload: true,
        trackedItemId: 1,
        trackedItemDisplayName: '21-4142',
        uploadStatus: 'FAILED',
        vaNotifyStatus: 'SENT',
      },
      {
        id: 9,
        acknowledgementDate: '2025-01-08T08:45:00.000Z',
        claimId: '654321987',
        createdAt: '2025-01-08T08:30:00.000Z',
        deleteDate: null,
        documentType: 'Private Medical Records',
        failedDate: '2025-01-08T08:50:00.000Z',
        fileName: 'psychiatric-evaluation.pdf',
        lighthouseUpload: true,
        trackedItemId: 2,
        trackedItemDisplayName: 'Private medical records',
        uploadStatus: 'FAILED',
        vaNotifyStatus: 'SENT',
      },
      {
        id: 10,
        acknowledgementDate: '2025-01-30T15:10:00.000Z',
        claimId: '987123456',
        createdAt: '2025-01-30T15:00:00.000Z',
        deleteDate: null,
        documentType: 'Military Personnel Record',
        failedDate: '2025-01-30T15:15:00.000Z',
        fileName: 'service-treatment-records.pdf',
        lighthouseUpload: true,
        trackedItemId: 3,
        trackedItemDisplayName: 'Military Personnel Record',
        uploadStatus: 'FAILED',
        vaNotifyStatus: 'SENT',
      },
      {
        id: 11,
        acknowledgementDate: '2025-01-03T10:30:00.000Z',
        claimId: '123456789',
        createdAt: '2025-01-03T10:15:00.000Z',
        deleteDate: null,
        documentType:
          'VA Form 21-4142, Authorization for Release of Information',
        failedDate: '2025-01-03T10:35:00.000Z',
        fileName: 'updated-authorization-form.pdf',
        lighthouseUpload: true,
        trackedItemId: 1,
        trackedItemDisplayName: '21-4142',
        uploadStatus: 'FAILED',
        vaNotifyStatus: 'SENT',
      },
    ],
  },

  'GET /v0/benefits_claims/1': getClaimDataById('1'),
  'GET /v0/benefits_claims/2': getClaimDataById('2'),
  'GET /v0/benefits_claims/3': getClaimDataById('3'),
  'GET /v0/benefits_claims/4': getClaimDataById('4'),
  'GET /v0/benefits_claims/5': getClaimDataById('5'),
  'GET /v0/benefits_claims/6': getClaimDataById('6'),
  'GET /v0/benefits_claims/7': getClaimDataById('7'),
  'GET /v0/benefits_claims/8': getClaimDataById('8'),
  'GET /v0/benefits_claims/9': getClaimDataById('9'),
  'GET /v0/benefits_claims/10': getClaimDataById('10'),

  'GET /v0/appeals': (_req, res) => {
    return res.status(200).json(appealData);
  },

  'GET /v0/appeals/1': {
    data: appealData1,
  },

  'GET /v0/claim_letters': [
    {
      documentId: '12345',
      receivedAt: '2024-10-15',
      docType: '184',
      typeDescription:
        'Notification Letter (e.g. VA 20-8993, VA 21-0290, PCGL)',
      fileName: 'VA_Decision_Letter_12345.pdf',
      claimId: '600571680',
      url: '/mock-letters/VA_Decision_Letter_12345.pdf',
    },
  ],

  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },

  'GET /v0/feature_toggles': {
    data: {
      type: 'feature_toggles',
      features: [
        { name: 'claim_letters_access', value: true },
        { name: 'cst_include_ddl_boa_letters', value: true },
        { name: 'cst_include_ddl_5103_letters', value: true },
        { name: 'benefits_documents_use_lighthouse', value: true },
        { name: 'cst_use_dd_rum', value: false },
        { name: 'cst_claim_phases', value: true }, // <-- controls 8-step claim process (disabilityCompensationClaim)
        { name: 'cst_5103_update_enabled', value: false }, // <-- controls access to ask-va-to-decide and 5103-evidence-notice routes
        { name: 'cst_show_document_upload_status', value: true },
      ],
    },
  },

  // Mock POST handler for file upload
  'POST /v0/benefits_claims/:claimId/benefits_documents': (() => {
    let uploadCount = 0;

    const errorResponses = {
      duplicate: {
        status: 422,
        errors: [
          {
            title: 'Unprocessable Entity',
            detail: 'DOC_UPLOAD_DUPLICATE',
            code: '422',
            status: '422',
            source: 'BenefitsDocuments::Service',
          },
        ],
      },
      invalidClaimant: {
        status: 422,
        errors: [
          {
            title: 'Unprocessable Entity',
            detail: 'DOC_UPLOAD_INVALID_CLAIMANT',
            code: '422',
            status: '422',
            source: 'BenefitsDocuments::Service',
          },
        ],
      },
      unknown: {
        status: 500,
        errors: [
          {
            title: 'Internal Server Error',
            code: '500',
            status: '500',
          },
        ],
      },
    };

    // Configuration for testing different scenarios
    const errorPattern = ['duplicate', 'unknown', 'invalidClaimant']; // Change this to test different scenarios
    // const errorPattern = [null]; // for success only

    return (_req, res) => {
      uploadCount += 1;
      const mockError = errorPattern[(uploadCount - 1) % errorPattern.length];

      // Simulate upload processing delay
      setTimeout(() => {
        if (mockError && errorResponses[mockError]) {
          const response = errorResponses[mockError];
          return res.status(response.status).json({ errors: response.errors });
        }

        // Success response
        return res.status(200).json({ jobId: `job-${Date.now()}` });
      }, 500);
    };
  })(),
};

module.exports = responses;
