/**
 * Creates a claim list item for /v0/benefits_claims
 *
 * @param {Object} overrides - Properties to override defaults
 * @param {string} overrides.claimDate - Claim submission date
 * @param {string} overrides.phaseChangeDate - Date claim moved to current phase
 * @param {string} overrides.phaseType - Current phase type (for 8-phase status text)
 * @param {string} overrides.claimTypeBase - Claim type base text
 * @param {string} overrides.claimTypeCode - Claim type code (determines 5 vs 8 phases)
 * @param {boolean} overrides.decisionLetterSent - Whether decision letter was sent
 * @param {boolean} overrides.developmentLetterSent - Whether development letter was sent
 * @param {string} overrides.displayTitle - Display title for the claim
 * @param {boolean} overrides.documentsNeeded - Whether documents are needed
 * @param {Array} overrides.evidenceSubmissions - Evidence submissions array (use createEvidenceSubmission)
 * @param {string} overrides.status - Claim status
 * @returns {Object} Claim list item object
 */
export const createBenefitsClaimListItem = ({
  claimDate = '2025-01-01',
  phaseChangeDate = '2025-01-02',
  phaseType = 'CLAIM_RECEIVED',
  claimTypeBase = 'compensation claim',
  claimTypeCode,
  decisionLetterSent,
  developmentLetterSent,
  displayTitle = 'Claim for compensation',
  documentsNeeded,
  evidenceSubmissions = [],
  status = 'CLAIM_RECEIVED',
} = {}) => ({
  id: '123456789',
  attributes: {
    claimDate,
    claimPhaseDates: {
      phaseChangeDate,
      phaseType,
    },
    claimTypeBase,
    claimTypeCode,
    decisionLetterSent,
    developmentLetterSent,
    displayTitle,
    documentsNeeded,
    evidenceSubmissions,
    status,
  },
});

/**
 * Creates an evidence submission
 * Used for both STEM and Benefits Claims - they share the same shape with different attribute values.
 *
 * @param {Object} overrides - Properties to override defaults
 * @param {number} overrides.id - Submission ID
 * @param {string} overrides.uploadStatus - Upload status
 * @param {string} overrides.acknowledgementDate - Future date ensures submission is always within the 30-day alert window
 * @param {string} overrides.failedDate - Date the upload failed
 * @param {string} overrides.documentType - Document type
 * @returns {Object} Evidence submission object
 */
export const createEvidenceSubmission = ({
  id = 12345,
  uploadStatus = 'FAILED', // Tests currently only use failed submissions
  acknowledgementDate = '2050-01-01T12:00:00.000Z',
  failedDate = '2025-01-15T12:00:00.000Z',
  // Configurable for context-appropriate values (e.g., 'STEM Supporting Documents' for STEM claims)
  documentType = 'Supporting Documents',
} = {}) => ({
  id,
  claimId: '123456789',
  uploadStatus,
  acknowledgementDate,
  createdAt: failedDate,
  deleteDate: null,
  documentType,
  failedDate,
  fileName: 'document.pdf',
  lighthouseUpload: true,
  trackedItemId: null,
  trackedItemDisplayName: null,
  vaNotifyStatus: 'SENT',
});

/**
 * Creates a tracked item
 *
 * @param {Object} overrides - Properties to override defaults
 * @param {string} overrides.displayName - Display name (determines heading logic via evidenceDictionary)
 * @returns {Object} Tracked item object
 */
export const createTrackedItem = ({
  displayName = 'Medical Records Request',
} = {}) => ({
  id: 1,
  status: 'NEEDED_FROM_YOU',
  friendlyName: 'Medical records',
  displayName,
  suspenseDate: '2050-01-01',
  shortDescription: 'Please provide your medical records.',
  description: '',
  closedDate: null,
  overdue: false,
  receivedDate: null,
  requestedDate: '2025-05-01',
  uploadsAllowed: true,
  canUploadFile: true,
  activityDescription: null,
  supportAliases: ['Medical Records Request'],
});

/**
 * Creates a claim detail for /v0/benefits_claims/:id
 *
 * @param {Object} overrides - Properties to override defaults
 * @param {Array} overrides.contentions - List of claimed conditions
 * @param {string} overrides.status - Claim status
 * @param {string|null} overrides.closeDate - Claim close date
 * @param {Array} overrides.evidenceSubmissions - Evidence submissions array
 * @param {Array} overrides.trackedItems - Tracked items
 * @param {boolean} overrides.currentPhaseBack - Whether claim moved back to current phase
 * @returns {Object} Claim detail object
 */
export const createBenefitsClaim = ({
  claimTypeCode = '010LCOMP',
  currentPhaseBack = false,
  latestPhaseType = 'GATHERING_OF_EVIDENCE',
  closeDate = null,
  contentions = [{ name: 'Tinnitus' }, { name: 'Hearing Loss' }],
  evidenceSubmissions = [],
  status = 'EVIDENCE_GATHERING_REVIEW_DECISION',
  trackedItems,
} = {}) => {
  // Commented out properties are part of the claim response but not currently used in the detail
  return {
    id: '123456789',
    type: 'claim',
    attributes: {
      claimTypeCode,
      claimDate: '2025-01-01',
      claimPhaseDates: {
        phaseChangeDate: '2025-01-02',
        currentPhaseBack,
        latestPhaseType,
        previousPhases: {
          phase1CompleteDate: '2025-01-02',
        },
      },
      claimType: 'Compensation',
      closeDate,
      contentions,
      decisionLetterSent: false,
      developmentLetterSent: true,
      documentsNeeded: true,
      endProductCode: '016',
      evidenceWaiverSubmitted5103: false,
      errors: [],
      evidenceSubmissions,
      jurisdiction: 'National Work Queue',
      lighthouseId: null,
      maxEstClaimDate: '2026-08-31',
      minEstClaimDate: '2026-02-01',
      status,
      submitterApplicationCode: 'VBMS',
      submitterRoleCode: 'VBA',
      supportingDocuments: [],
      tempJurisdiction: 'Milwaukee',
      trackedItems: trackedItems || [
        {
          closedDate: null,
          description: '<VA Medical Facility>',
          displayName: 'DBQ AUDIO Hearing Loss and Tinnitus',
          overdue: false,
          receivedDate: null,
          requestedDate: '2025-03-01',
          status: 'NEEDED_FROM_OTHERS',
          suspenseDate: '2050-01-01',
          id: 123456,
          uploadsAllowed: true,
          canUploadFile: false,
          friendlyName: 'Disability exam for hearing',
          activityDescription: null,
          shortDescription: null,
          supportAliases: [
            'DBQ AUDIO Hearing Loss and Tinnitus',
            'Hearing Exam',
            'Audio Exam',
          ],
        },
        {
          closedDate: null,
          description: '      ',
          displayName: 'RV1 - Reserve Records Request',
          overdue: true,
          receivedDate: null,
          requestedDate: '2025-04-01',
          status: 'NEEDED_FROM_OTHERS',
          suspenseDate: '2050-01-01',
          id: 654321,
          uploadsAllowed: true,
          canUploadFile: true,
          friendlyName: 'Reserve records',
          activityDescription:
            "We've requested your reserve records on your behalf. No action is needed.",
          shortDescription:
            "We've requested your service records or treatment records from your reserve unit.",
          supportAliases: ['RV1 - Reserve Records Request'],
        },
      ],
      canUpload: true,
    },
  };
};
