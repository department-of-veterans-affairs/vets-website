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

const createStemClaim = (
  id,
  {
    confirmationNumber,
    isEnrolledStem = true,
    isPursuingTeachingCert = null,
    benefitLeft = 'moreThanSixMonths',
    remainingEntitlement = null,
    automatedDenial = true,
    deniedAt,
    submittedAt,
  },
) => ({
  id,
  type: 'education_benefits_claims',
  attributes: {
    confirmationNumber,
    isEnrolledStem,
    isPursuingTeachingCert,
    benefitLeft,
    remainingEntitlement,
    automatedDenial,
    deniedAt,
    submittedAt,
  },
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
    contentions = [],
    previousPhases = {},
  },
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
      contentions,
      events: [
        createEvent(claimDate, 'CLAIM_RECEIVED'),
        ...(phaseType !== 'CLAIM_RECEIVED'
          ? [createEvent(claimDate, phaseType)]
          : []),
      ],
      issues,
      evidence,
      trackedItems: [
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
      ],
    },
  },
});

const appealData1 = {
  id: 'SC10755',
  type: 'supplementalClaim',
  attributes: {
    appealIds: ['SC10755'],
    updated: '2025-06-27T10:48:58-04:00',
    incompleteHistory: true, // Changed to true to trigger Missing Events Alert
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
    alerts: [
      {
        type: 'scheduled_hearing',
        details: {
          date: '2024-12-15',
        },
      },
      {
        type: 'held_for_evidence',
        details: {
          dueDate: '2024-11-30',
        },
      },
      {
        type: 'decision_soon',
        details: {},
      },
    ],
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
    ],
    events: [
      {
        type: 'sc_request',
        date: '2024-10-25',
      },
    ],
    evidence: [],
  },
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
    contentions: [{ name: 'Back pain' }, { name: 'Tinnitus' }],
    claimType: null, // missing claimType forces the Adding Details alert on claim status page
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
  // Disability compensation claim with phase moved back (triggers phase stepper alert)
  {
    data: {
      id: '5',
      type: 'claim',
      attributes: {
        baseEndProductCode: '020',
        claimDate: '2024-09-15',
        claimPhaseDates: {
          phaseChangeDate: '2024-10-20',
          currentPhaseBack: true, // This triggers the "moved back" alert in phase stepper
          phaseType: 'GATHERING_OF_EVIDENCE',
          latestPhaseType: 'GATHERING_OF_EVIDENCE',
          previousPhases: {
            phase3CompleteDate: '2024-09-20',
            phase4CompleteDate: '2024-10-01', // Was in phase 4, then moved back
            phase5CompleteDate: null,
            phase6CompleteDate: null,
            phase7CompleteDate: null,
          },
        },
        claimType: 'Disability Compensation',
        claimTypeCode: '020SMB', // valid disability compensation claim type
        closeDate: null,
        decisionLetterSent: false,
        developmentLetterSent: true,
        documentsNeeded: false,
        endProductCode: undefined,
        evidenceWaiverSubmitted5103: false,
        lighthouseId: null,
        status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
        hasFailedUploads: false,
        supportingDocuments: [
          createSupportingDocument(
            '{B9B8B809-F4GE-55GB-CD89-1E26640DDD11}',
            'Medical Records',
            'hearing_test_results.pdf',
            445678,
            '2024-09-20',
          ),
          createSupportingDocument(
            '{C9C8C809-G5HF-66HC-DE90-2F37751EEE22}',
            'Service Treatment Records',
            'service_medical_records.pdf',
            667890,
            '2024-10-15',
          ),
        ],
        contentions: [
          {
            name: 'Service connection for hearing loss',
          },
          {
            name: 'Service connection for knee condition',
          },
        ],
        events: [
          createEvent('2024-09-15', 'CLAIM_RECEIVED'),
          createEvent('2024-09-20', 'UNDER_REVIEW'),
          createEvent('2024-10-01', 'GATHERING_OF_EVIDENCE'),
          createEvent('2024-10-20', 'GATHERING_OF_EVIDENCE'), // Moved back event
        ],
        issues: [
          createIssue(
            'Service connection for hearing loss',
            '6100',
            '2024-09-15',
            '2024-09-20',
          ),
          createIssue(
            'Service connection for knee condition',
            '5257',
            '2024-09-15',
            '2024-09-20',
          ),
        ],
        evidence: [
          createEvidence(
            '2024-09-15',
            'VA Form 21-526EZ, Application for Disability Compensation',
          ),
          createEvidence('2024-10-20', 'Additional medical evidence requested'),
        ],
      },
    },
  },
];

// STEM Claims
const baseStemClaims = [
  createStemClaim('9043', {
    confirmationNumber: 'V-EBC-9043',
    isEnrolledStem: true,
    isPursuingTeachingCert: null,
    benefitLeft: 'moreThanSixMonths',
    automatedDenial: true,
    deniedAt: '2022-01-31T15:08:20.489Z',
    submittedAt: '2022-01-31T15:08:20.489Z',
  }),
  createStemClaim('9317', {
    confirmationNumber: 'V-EBC-9317',
    isEnrolledStem: false,
    isPursuingTeachingCert: false,
    benefitLeft: 'sixMonthsOrLess',
    automatedDenial: true,
    deniedAt: '2022-02-10T22:33:22.668Z',
    submittedAt: '2022-02-10T22:33:22.668Z',
  }),
  createStemClaim('9048', {
    confirmationNumber: 'V-EBC-9048',
    isEnrolledStem: true,
    isPursuingTeachingCert: true,
    benefitLeft: 'sixMonthsOrLess',
    automatedDenial: true,
    deniedAt: '2022-01-31T18:19:52.045Z',
    submittedAt: '2022-01-31T18:19:52.045Z',
  }),
];

function getClaimDataById(id) {
  const claim = baseClaims.find(c => c.data.id === id);
  return claim || null;
}

function getStemClaimById(id) {
  const claim = baseStemClaims.find(c => c.id === id);
  return claim ? { data: claim } : null;
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
const USE_MANY_CLAIMS = false;

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

  'GET /v0/benefits_claims/1': getClaimDataById('1'),
  'GET /v0/benefits_claims/2': getClaimDataById('2'),
  'GET /v0/benefits_claims/3': getClaimDataById('3'),
  'GET /v0/benefits_claims/4': getClaimDataById('4'),
  'GET /v0/benefits_claims/5': getClaimDataById('5'),

  // STEM Claims endpoints
  'GET /v0/education_benefits_claims/stem_claim_status': {
    data: baseStemClaims,
  },
  'GET /v0/education_benefits_claims/stem_claim_status/9043': getStemClaimById(
    '9043',
  ),
  'GET /v0/education_benefits_claims/stem_claim_status/9317': getStemClaimById(
    '9317',
  ),
  'GET /v0/education_benefits_claims/stem_claim_status/9048': getStemClaimById(
    '9048',
  ),

  'GET /v0/appeals': {
    data: [appealData1],
    meta: {
      pagination: {
        currentPage: 1,
        perPage: 10,
        totalPages: 1,
        totalEntries: 1,
      },
    },
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
        { name: 'stem_automated_decision', value: true }, // <-- enables STEM claims to show in claims list
      ],
    },
  },
};

module.exports = responses;
