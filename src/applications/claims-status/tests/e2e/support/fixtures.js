/**
 * Creates a failed evidence submission
 *
 * @param {Object} overrides - Properties to override defaults
 * @param {string} overrides.failedDate - Date the upload failed
 * @returns {Object} Failed evidence submission object
 */
export const createFailedSubmission = ({
  failedDate = '2025-01-15T12:00:00.000Z',
} = {}) => ({
  id: 12345,
  claimId: '123456789',
  uploadStatus: 'FAILED',
  acknowledgementDate: '2030-12-31T23:59:59.999Z', // Future date so it's within 30 days
  createdAt: failedDate,
  deleteDate: null,
  documentType: 'Supporting Documents',
  failedDate,
  fileName: 'medical-records.pdf',
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
 * Creates a claim
 *
 * @param {Object} overrides - Properties to override defaults
 * @param {Array} overrides.contentions - List of claimed conditions
 * @param {string} overrides.status - Claim status
 * @param {string|null} overrides.closeDate - Claim close date
 * @param {Array} overrides.evidenceSubmissions - Evidence submissions array
 * @param {Array} overrides.trackedItems - Tracked items
 * @returns {Object} Claim object
 */
export const createClaim = ({
  contentions = [{ name: 'Tinnitus' }, { name: 'Hearing Loss' }],
  status = 'EVIDENCE_GATHERING_REVIEW_DECISION',
  closeDate = null,
  evidenceSubmissions = [],
  trackedItems,
  claimTypeCode = '010LCOMP',
  latestPhaseType = 'GATHERING_OF_EVIDENCE',
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
        currentPhaseBack: false,
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
          id: 585393,
          uploadsAllowed: true,
          canUploadFile: false,
          friendlyName: 'Disability exam for hearing',
          activityDescription: null,
          shortDescription: null,
          supportAliases: ['DBQ AUDIO Hearing Loss and Tinnitus'],
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
          id: 585394,
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
