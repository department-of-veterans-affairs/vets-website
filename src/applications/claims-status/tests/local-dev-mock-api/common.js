// ============================================================
// SERVICE AVAILABILITY CONFIGURATION
// Toggle these to test different service unavailability scenarios
// ============================================================
const SERVICE_AVAILABILITY = {
  claims: true, // Set to false to simulate claims API returning 500
  appeals: true, // Set to false to simulate appeals API returning 500
};

// ============================================================
// EMPTY DATA CONFIGURATION
// Toggle these to test scenarios with no claims/appeals data
// (services return 200 OK but with empty arrays)
// ============================================================
const RETURN_EMPTY_DATA = {
  claims: false, // Set to true to return empty claims array
  appeals: false, // Set to true to return empty appeals array
};

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

const createTrackedItem = (id, displayName, isFirstParty, options = {}) => ({
  id,
  displayName,
  status: isFirstParty ? 'NEEDED_FROM_YOU' : 'NEEDED_FROM_OTHERS',
  ...options,
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
    trackedItemFriendlyName = null,
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
  trackedItemFriendlyName,
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
              createTrackedItem(1, '21-4142/21-4142a', true, {
                suspenseDate: '2026-12-01',
                type: 'other',
              }),
              createTrackedItem(2, 'Private medical records', false, {
                suspenseDate: '2026-12-10',
                type: 'other',
              }),
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
  // Claim 1: Has 3 NEEDED_FROM_YOU tracked items
  // Tests: "What you need to do" cards on Status tab + Recent Activity with REQUESTED FOR YOU tag
  createClaim(
    '1',
    {
      baseEndProductCode: '010',
      claimDate: '2024-12-15',
      phaseType: 'GATHERING_OF_EVIDENCE',
      claimType: 'Compensation',
      claimTypeCode: '010LCOMP',
      endProductCode: '016',
      status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
      closeDate: null,
      documentsNeeded: true,
      developmentLetterSent: true,
      evidenceWaiverSubmitted5103: false,
      previousPhases: {
        phase1CompleteDate: '2024-12-15',
        phase2CompleteDate: '2024-12-20',
      },
      issues: [
        createIssue(
          'Service connection for PTSD',
          '9411',
          '2024-12-15',
          '2024-12-20',
        ),
        createIssue(
          'Service connection for tinnitus',
          '6260',
          '2024-12-15',
          '2024-12-20',
        ),
      ],
      evidence: [
        createEvidence(
          '2024-12-15',
          'VA Form 21-526EZ, Application for Disability Compensation and Related Compensation Benefits',
        ),
      ],
      evidenceSubmissions: [
        createEvidenceSubmission(111, 1, {
          acknowledgementDate: new Date(
            Date.now() + 25 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          createdAt: new Date(
            Date.now() - 3 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          documentType: 'Medical Treatment Records',
          failedDate: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          fileName: 'medical-records.pdf',
        }),
      ],
      contentions: [
        { name: 'Service connection for PTSD' },
        { name: 'Service connection for tinnitus' },
      ],
      trackedItems: [
        // NEEDED_FROM_YOU #1: "Provide authorization to disclose information"
        // Has requestedDate → appears in Recent Activity with REQUESTED FOR YOU tag
        createTrackedItem(1, '21-4142/21-4142a', true, {
          requestedDate: '2025-01-15',
          suspenseDate: '2025-09-21',
          friendlyName: 'Authorization to disclose information',
          shortDescription:
            'We need your permission to request your personal information from a non-VA source, like a private doctor or hospital.',
          activityDescription:
            'We requested your proof of service on your behalf. No action is needed.',
          canUploadFile: true,
        }),
        // NEEDED_FROM_YOU #2: "Provide witness or corroboration statements"
        createTrackedItem(2, 'Submit buddy statement(s)', true, {
          suspenseDate: '2025-10-31',
          friendlyName: 'Witness or corroboration statements',
          shortDescription:
            'We need statements from people who know about your condition.',
          canUploadFile: true,
        }),
        // NEEDED_FROM_YOU #3: "Request for evidence" (isSensitive hides displayName)
        createTrackedItem(3, 'Expense Information Requested', true, {
          suspenseDate: '2025-01-21',
          isSensitive: true,
          shortDescription:
            'Additional information concerning your expenses is needed. Please fill out Sections I through V of the enclosed VA Form 21P-8049.',
          canUploadFile: true,
        }),
      ],
    },
    false,
  ),

  // Claim 2: documentsNeeded=true but NO NEEDED_FROM_YOU tracked items
  // Tests: blue info alert auto-dismissed (all requests addressed)
  createClaim(
    '2',
    {
      baseEndProductCode: '010',
      claimDate: '2025-06-20',
      phaseType: 'GATHERING_OF_EVIDENCE',
      claimType: 'Compensation',
      claimTypeCode: '010LCOMP',
      endProductCode: '015',
      status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
      closeDate: null,
      documentsNeeded: true,
      developmentLetterSent: true,
      evidenceWaiverSubmitted5103: false,
      issues: [
        createIssue(
          'Service connection for back injury',
          '5237',
          '2025-06-20',
          '2025-06-25',
        ),
      ],
      evidence: [
        createEvidence(
          '2025-06-20',
          'VA Form 21-526EZ, Application for Disability Compensation and Related Compensation Benefits',
        ),
      ],
      evidenceSubmissions: [],
      contentions: [{ name: 'Service connection for back injury' }],
      trackedItems: [
        // NEEDED_FROM_OTHERS only
        createTrackedItem(1, 'Private medical records', false, {
          requestedDate: '2025-07-01',
          suspenseDate: '2025-10-01',
          type: 'other',
        }),
        // Already reviewed
        createTrackedItem(2, '21-4142/21-4142a', true, {
          status: 'INITIAL_REVIEW_COMPLETE',
          receivedDate: '2025-08-15',
          closedDate: null,
          suspenseDate: '2025-10-01',
          friendlyName: 'Authorization to disclose information',
        }),
        // Accepted
        createTrackedItem(3, 'Submit buddy statement(s)', true, {
          status: 'ACCEPTED',
          receivedDate: '2025-08-20',
          closedDate: null,
          suspenseDate: '2025-10-15',
          friendlyName: 'Witness or corroboration statements',
        }),
      ],
    },
    false,
  ),

  // Claim 3: Closed claim
  createClaim(
    '3',
    {
      baseEndProductCode: '010',
      claimDate: '2025-01-15',
      phaseType: 'COMPLETE',
      claimType: 'Compensation',
      claimTypeCode: '010LCOMP',
      endProductCode: '010',
      status: 'COMPLETE',
      closeDate: '2025-09-10',
      decisionLetterSent: true,
      documentsNeeded: false,
      evidenceWaiverSubmitted5103: true,
      issues: [
        createIssue(
          'Service connection for hearing loss',
          '6100',
          '2025-01-15',
          '2025-09-10',
        ),
      ],
      evidence: [
        createEvidence(
          '2025-01-15',
          'VA Form 21-526EZ, Application for Disability Compensation and Related Compensation Benefits',
        ),
      ],
      evidenceSubmissions: [],
      contentions: [{ name: 'Service connection for hearing loss' }],
      trackedItems: [],
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

const claimsToUse = baseClaims;

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

  'GET /v0/benefits_claims': (_req, res) => {
    if (!SERVICE_AVAILABILITY.claims) {
      // Only status code matters - frontend doesn't parse error body
      return res.status(500).json({ errors: [] });
    }
    const claimsData = RETURN_EMPTY_DATA.claims
      ? []
      : claimsToUse.map(getClaimSummary);
    return res.status(200).json({
      data: claimsData,
      meta: {
        pagination: {
          currentPage: 1,
          perPage: 10,
          totalPages: RETURN_EMPTY_DATA.claims ? 0 : 1,
          totalEntries: RETURN_EMPTY_DATA.claims ? 0 : claimsData.length,
        },
      },
    });
  },

  'GET /v0/benefits_claims/failed_upload_evidence_submissions': {
    data: [],
  },

  'GET /v0/benefits_claims/1': getClaimDataById('1'),
  'GET /v0/benefits_claims/2': getClaimDataById('2'),
  'GET /v0/benefits_claims/3': getClaimDataById('3'),

  'GET /v0/appeals': (_req, res) => {
    if (!SERVICE_AVAILABILITY.appeals) {
      // Only status code matters - frontend doesn't parse error body
      return res.status(500).json({ errors: [] });
    }
    return res
      .status(200)
      .json(RETURN_EMPTY_DATA.appeals ? { data: [] } : appealData);
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

  'POST /v0/benefits_claims/:id/submit5103': (_req, res) => {
    const hasError = true;

    if (hasError) {
      return res.status(500).json({
        errors: [
          {
            title: 'Internal Server Error',
            detail: 'An error occurred while processing your request',
            code: '500',
            status: '500',
          },
        ],
      });
    }

    return res.status(200).json({ jobId: `job-${Date.now()}` });
  },

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
    // Appropriate values:
    // - 'duplicate',
    // - 'invalidClaimant',
    // - 'unknown'
    // - null for success only
    const errorPattern = ['unknown'];

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
