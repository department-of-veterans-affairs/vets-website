/* eslint-disable camelcase */

/**
 * REFERENCE:
 * Claims Status Application Routes
 *
 * Main Routes:
 * /                              - Root route (redirects to "your-claims")
 * /your-claims                   - Main claims list page
 * /your-claim-letters           - Claim letters page
 * /your-stem-claims/:id         - STEM claims page
 *
 * Claim Detail Routes (under /your-claims/:id):
 * /your-claims/:id/status                    - Claim status page
 * /your-claims/:id/files                     - Claim files page
 * /your-claims/:id/overview                  - Claim overview page
 * /your-claims/:id/ask-va-to-decide         - Ask VA to decide page
 * /your-claims/:id/5103-evidence-notice     - 5103 evidence notice page
 * /your-claims/:id/claim-estimate           - Claim estimation page
 * /your-claims/:id/document-request/:trackedItemId    - Document request page
 * /your-claims/:id/needed-from-you/:trackedItemId     - Documents needed from you page
 * /your-claims/:id/needed-from-others/:trackedItemId  - Documents needed from others page
 *
 * Appeal Routes (under /appeals/:id):
 * /appeals/:id/status           - Appeal status page
 * /appeals/:id/detail           - Appeal detail page
 *
 * STEM Claim Routes (under /your-stem-claims/:id):
 * /your-stem-claims/:id/status  - STEM claim status page
 *
 * Components:
 * - YourClaimsPageV2           - Main claims list
 * - ClaimPage                  - Individual claim page
 * - ClaimStatusPage           - Claim status
 * - FilesPage                 - Claim files
 * - OverviewPage              - Claim overview
 * - AskVAPage                 - Ask VA to decide
 * - Standard5103NoticePage    - 5103 evidence notice
 * - ClaimEstimationPage       - Claim estimation
 * - DocumentRequestPage       - Document requests
 * - DocumentRedirectPage      - Document redirects
 * - AppealsV2StatusPage       - Appeal status
 * - AppealsV2DetailPage       - Appeal details
 * - StemClaimStatusPage       - STEM claim status
 * - YourClaimLetters          - Claim letters
 *
 * Feature Toggles:
 * - cst5103UpdateEnabled      - Controls access to ask-va-to-decide and 5103-evidence-notice routes
 * - cstClaimPhases            -
 * - cst5103UpdateEnabled      - Needed to view va-accordion
 * - claimLettersAccess
 */

const createClaimPhaseDates = (
  claimDate,
  phaseType,
  previousPhases = {},
  disability = false,
) =>
  disability
    ? {
        phaseChangeDate: claimDate,
        currentPhaseBack: false,
        latestPhaseType: phaseType, // 8 step process expects `latestPhaseType` instead of phaseType.
        previousPhases,
      }
    : {
        phaseChangeDate: claimDate,
        currentPhaseBack: false,
        phaseType,
        previousPhases,
      };

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
  disability = false,
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
        disability,
      ),
      claimType,
      claimTypeCode,
      closeDate: null,
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
          middleName: 'Doe',
          lastName: 'Weaver',
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
        { name: 'cst_claim_phases', value: true }, // <-- controles 8-step claim process (disabilityCompensationClaim)
        { name: 'cst_5103_update_enabled', value: true }, // <-- controls access to ask-va-to-decide and 5103-evidence-notice routes
        { name: 'cstClaimPhases', value: true }, // for camelCase variant
        { name: 'cst5103UpdateEnabled', value: true }, // for camelCase variant
      ],
    },
  },

  'GET /v0/benefits_claims': {
    data: [
      {
        // TODO should trigger closedClaimAlert by having a closeDate, and status set to COMPLETE.
        id: '1',
        type: 'claim',
        attributes: {
          baseEndProductCode: '120',
          claimDate: '2024-10-12',
          claimPhaseDates: {
            phaseChangeDate: '2024-10-16',
            phaseType: 'COMPLETE',
          },
          claimType: 'Pension',
          claimTypeCode: '120ILCP7PMC',
          closeDate: '2024-10-16',
          decisionLetterSent: true,
          developmentLetterSent: true,
          documentsNeeded: false,
          endProductCode: '121',
          evidenceWaiverSubmitted5103: true,
          lighthouseId: null,
          status: 'COMPLETE',
          hasFailedUploads: false,
          contentions: [
            {
              name: 'Pension claim',
            },
          ],
        },
      },
      {
        // triggers `/track-claims/your-claims/2/ask-va-to-decide` view
        id: '2',
        type: 'claim',
        attributes: {
          baseEndProductCode: '020',
          claimDate: '2024-11-01',
          claimPhaseDates: {
            phaseChangeDate: '2024-11-05',
            phaseType: 'GATHERING_OF_EVIDENCE',
          },
          claimType: 'Compensation',
          claimTypeCode: '020CPHLP',
          closeDate: null,
          decisionLetterSent: false,
          developmentLetterSent: true,
          documentsNeeded: false,
          endProductCode: '022',
          evidenceWaiverSubmitted5103: false,
          lighthouseId: null,
          status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
          hasFailedUploads: false,
          contentions: [
            { name: 'Service connection for PTSD' },
            { name: 'Service connection for tinnitus' },
          ],
        },
      },
      {
        id: '3',
        type: 'claim',
        attributes: {
          baseEndProductCode: '020',
          claimDate: '2024-10-11',
          claimPhaseDates: {
            phaseChangeDate: '2024-10-16',
            phaseType: 'GATHERING_OF_EVIDENCE',
          },
          claimType: 'Compensation',
          claimTypeCode: '020CPHLP',
          closeDate: null,
          decisionLetterSent: false,
          developmentLetterSent: true,
          documentsNeeded: true,
          endProductCode: '022',
          evidenceWaiverSubmitted5103: true,
          lighthouseId: null,
          status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
          hasFailedUploads: false,
        },
      },
      {
        id: '4',
        type: 'claim',
        attributes: {
          baseEndProductCode: '020',
          claimDate: '2024-10-10',
          claimPhaseDates: {
            phaseChangeDate: '2024-10-15',
            phaseType: 'GATHERING_OF_EVIDENCE',
          },
          claimType: 'Compensation',
          // 8 step claim process is triggered when claimTypeCode is listed in disabilityCompensationClaimTypeCodes && cstClaimPhasesEnabled is true.
          claimTypeCode: '020SMB', // is a disabilityCompensationClaimTypeCode now go toggle cstClaimPhases feature flag.
          closeDate: null,
          decisionLetterSent: false,
          developmentLetterSent: true,
          documentsNeeded: false,
          endProductCode: '022',
          evidenceWaiverSubmitted5103: true,
          lighthouseId: null,
          status: 'GATHERING_OF_EVIDENCE',
          hasFailedUploads: false,
          contentions: [
            {
              name: 'Service connection for PTSD',
            },
            {
              name: 'Service connection for tinnitus',
            },
          ],
        },
      },
    ],
    meta: {
      pagination: {
        currentPage: 1,
        perPage: 10,
        totalPages: 3,
        totalEntries: 30,
      },
    },
  },

  'GET /v0/benefits_claims/1': createClaim('1', {
    baseEndProductCode: '120',
    claimDate: '2024-10-12',
    phaseType: 'GATHERING_OF_EVIDENCE',
    claimType: 'Pension',
    claimTypeCode: '120ILCP7PMC',
    endProductCode: '121',
    status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
    developmentLetterSent: true,
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
        'Johnnie_Weaver_1_5103.pdf',
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

  // this claim was created to display `/track-claims/your-claims/<CLAIM_ID>/ask-va-to-decide`
  'GET /v0/benefits_claims/2': createClaim('2', {
    baseEndProductCode: '020',
    claimDate: '2024-11-01',
    phaseType: 'GATHERING_OF_EVIDENCE',
    claimType: 'Compensation',
    claimTypeCode: '020CPHLP',
    endProductCode: '022',
    status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
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

  // TODO: This claim is currently broken in the overview view
  'GET /v0/benefits_claims/3': createClaim('3', {
    baseEndProductCode: '020',
    claimDate: '2024-10-11',
    phaseType: 'GATHERING_OF_EVIDENCE', // 5-step process uses phaseType
    claimType: 'Compensation',
    claimTypeCode: '020CPHLP', // 5-step process code
    endProductCode: '022',
    status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
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
        'Johnnie_Weaver_600571685_5103.pdf',
        null,
        '2024-10-16',
      ),
      createSupportingDocument(
        '{9653a1dc-49ca-4aa1-842c-bbe8716df8e4}',
        'Birth Certificate',
        '12-2024_Benefits_Portfolio_Product_All_Hands.pdf',
        null,
        '2025-06-11',
      ),
      createSupportingDocument(
        '{b04c2576-98f4-493e-b0f9-a49254e4425c}',
        'Birth Certificate',
        '12-2024_Benefits_Portfolio_Product_All_Hands.pdf',
        null,
        '2025-06-10',
      ),
      createSupportingDocument(
        '{89f6cf4a-6862-4a45-99cd-d36b86970b90}',
        'Military Personnel Record',
        'Claims_optimization.pdf',
        529616,
        '2025-05-27',
      ),
    ],
    contentions: [
      // contentions are empty to force the slim alert on the claim status page
    ],
  }),

  'GET /v0/benefits_claims/4': createClaim(
    '4',
    {
      baseEndProductCode: '020',
      claimDate: '2024-10-10',
      phaseType: 'GATHERING_OF_EVIDENCE',
      claimType: 'Compensation',
      claimTypeCode: '020SMB', // must match the list endpoint for 8-step process
      endProductCode: '022',
      status: 'GATHERING_OF_EVIDENCE',
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
          '{9653a1dc-49ca-4aa1-842c-bbe8716df8e3}',
          'Birth Certificate',
          '12-2024_Benefits_Portfolio_Product_All_Hands.pdf',
          null,
          '2025-06-09',
        ),
        createSupportingDocument(
          '{b04c2576-98f4-493e-b0f9-a49254e4425b}',
          'Birth Certificate',
          '12-2024_Benefits_Portfolio_Product_All_Hands.pdf',
          null,
          '2025-06-08',
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
    },
    true,
  ),

  'GET /v0/appeals': {
    data: [
      {
        id: '1',
        type: 'appeal',
        attributes: {
          appealIds: {
            appeal: '1',
            legacyAppeal: null,
          },
          appealStatus: 'active',
          appealType: 'original',
          aoj: 'vba',
          caseType: 'post_remand',
          docketNumber: '1',
          docketType: 'evidence_submission',
          filingDate: '2024-01-01',
          isActive: true,
          issues: [
            {
              active: true,
              description: 'Service connection for PTSD',
              diagnosticCode: '9411',
              lastAction: '2024-01-15',
              date: '2024-01-01',
            },
            {
              active: true,
              description: 'Service connection for tinnitus',
              diagnosticCode: '6260',
              lastAction: '2024-01-15',
              date: '2024-01-01',
            },
          ],
          location: 'bva',
          programArea: 'compensation',
          status: {
            type: 'active',
            details: {
              lastActionDate: '2024-01-15',
              lastAction: 'Evidence submission period ended',
            },
          },
          updatedAt: '2024-01-15T00:00:00.000Z',
          events: [
            {
              date: '2024-01-01',
              type: 'appeal_received',
            },
            {
              date: '2024-01-15',
              type: 'evidence_submission_period_ended',
            },
          ],
          documents: [
            {
              documentId: '{A8A7A709-E3FD-44FA-99C9-C3B772AD0201}',
              documentTypeLabel: 'Appeal Form',
              originalFileName: 'VA Form 9.pdf',
              uploadDate: '2024-01-01',
            },
            {
              documentId: '{9baad655-ab8d-4bfa-b78c-58675dfc6896}',
              documentTypeLabel: 'Evidence',
              originalFileName: 'medical_evidence.pdf',
              uploadDate: '2024-01-10',
            },
          ],
        },
      },
    ],
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
    data: {
      id: '1',
      type: 'appeal',
      attributes: {
        appealIds: {
          appeal: '1',
          legacyAppeal: null,
        },
        appealStatus: 'active',
        appealType: 'original',
        aoj: 'vba',
        caseType: 'post_remand',
        docketNumber: '1',
        docketType: 'evidence_submission',
        filingDate: '2024-01-01',
        isActive: true,
        issues: [
          {
            active: true,
            description: 'Service connection for PTSD',
            diagnosticCode: '9411',
            lastAction: '2024-01-15',
            date: '2024-01-01',
          },
          {
            active: true,
            description: 'Service connection for tinnitus',
            diagnosticCode: '6260',
            lastAction: '2024-01-15',
            date: '2024-01-01',
          },
        ],
        location: 'bva',
        programArea: 'compensation',
        status: {
          type: 'active',
          details: {
            lastActionDate: '2024-01-15',
            lastAction: 'Evidence submission period ended',
          },
        },
        updatedAt: '2024-01-15T00:00:00.000Z',
        events: [
          {
            date: '2024-01-01',
            type: 'appeal_received',
          },
          {
            date: '2024-01-15',
            type: 'evidence_submission_period_ended',
          },
        ],
        documents: [
          {
            documentId: '{A8A7A709-E3FD-44FA-99C9-C3B772AD0201}',
            documentTypeLabel: 'Appeal Form',
            originalFileName: 'VA Form 9.pdf',
            uploadDate: '2024-01-01',
          },
          {
            documentId: '{9baad655-ab8d-4bfa-b78c-58675dfc6896}',
            documentTypeLabel: 'Evidence',
            originalFileName: 'medical_evidence.pdf',
            uploadDate: '2024-01-10',
          },
        ],
      },
    },
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
};

module.exports = responses;
