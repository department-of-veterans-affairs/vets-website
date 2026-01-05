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
 * @param {string} overrides.uploadStatus - Upload status (QUEUED, PENDING, SUCCESS, FAILED)
 * @param {string} overrides.acknowledgementDate - Future date ensures submission is always within the 30-day alert window
 * @param {string} overrides.createdAt - Date the submission was created
 * @param {string} overrides.failedDate - Date the upload failed (null for non-failed submissions)
 * @param {string} overrides.documentType - Document type
 * @param {string} overrides.fileName - File name for the submission
 * @param {number|null} overrides.trackedItemId - Associated tracked item ID
 * @param {string|null} overrides.trackedItemDisplayName - Display name of associated tracked item
 * @returns {Object} Evidence submission object
 */
export const createEvidenceSubmission = ({
  id = 12345,
  uploadStatus = 'QUEUED',
  acknowledgementDate = null,
  createdAt = '2025-01-15T12:00:00.000Z',
  failedDate = null,
  documentType = 'Supporting Documents',
  fileName = 'document.pdf',
  trackedItemId = null,
  trackedItemDisplayName = null,
} = {}) => ({
  id,
  claimId: '123456789',
  uploadStatus,
  acknowledgementDate,
  createdAt,
  deleteDate: null,
  documentType,
  failedDate,
  fileName,
  lighthouseUpload: true,
  trackedItemId,
  trackedItemDisplayName,
  vaNotifyStatus: uploadStatus === 'FAILED' ? 'SENT' : null,
});

/**
 * Creates multiple evidence submissions for pagination testing
 *
 * @param {number} count - Number of evidence submissions to create
 * @param {Object} overrides - Properties to override defaults for each submission
 * @returns {Array} Array of evidence submission objects
 */
export const createMultipleEvidenceSubmissions = (count, overrides = {}) => {
  return Array.from({ length: count }, (_, i) =>
    createEvidenceSubmission({
      id: i + 1,
      fileName: `document-${i + 1}.pdf`,
      ...overrides,
    }),
  );
};

/**
 * Creates a supporting document (files received/reviewed by VA)
 *
 * @param {Object} overrides - Properties to override defaults
 * @param {string} overrides.documentId - Unique document ID
 * @param {string} overrides.documentTypeLabel - Document type label
 * @param {string} overrides.originalFileName - Original file name
 * @param {number|null} overrides.trackedItemId - Associated tracked item ID
 * @param {string} overrides.uploadDate - Date the document was uploaded
 * @param {string} overrides.date - Date for FilesReceived (uses date property)
 * @returns {Object} Supporting document object
 */
export const createSupportingDocument = ({
  documentId = '{54EF0C16-A9E7-4C3F-B876-B2C7BEC1F834}',
  documentTypeLabel = 'Correspondence',
  originalFileName = 'document.pdf',
  trackedItemId = null,
  uploadDate = '2025-01-15',
  date = '2025-01-15',
} = {}) => ({
  documentId,
  documentTypeLabel,
  originalFileName,
  trackedItemId,
  uploadDate,
  date,
});

/**
 * Creates multiple supporting documents for pagination testing
 *
 * @param {number} count - Number of supporting documents to create
 * @param {Object} overrides - Properties to override defaults for each document
 * @returns {Array} Array of supporting document objects
 */
export const createMultipleSupportingDocuments = (count, overrides = {}) => {
  return Array.from({ length: count }, (_, i) =>
    createSupportingDocument({
      documentId: `{54EF0C16-A9E7-4C3F-B876-B2C7BEC1F${String(834 + i).padStart(
        3,
        '0',
      )}}`,
      originalFileName: `document-${i + 1}.pdf`,
      uploadDate: `2025-01-${String(1 + i).padStart(2, '0')}`,
      ...overrides,
    }),
  );
};

/**
 * Creates a tracked item
 *
 * @param {Object} overrides - Properties to override defaults
 * @param {number} overrides.id - Tracked item ID
 * @param {string} overrides.displayName - Display name (determines heading logic via evidenceDictionary)
 * @param {string} overrides.status - Tracked item status
 * @param {string} overrides.requestedDate - Date the item was requested
 * @param {string|null} overrides.closedDate - Date the item was closed (for NO_LONGER_REQUIRED status)
 * @returns {Object} Tracked item object
 */
export const createTrackedItem = ({
  id = 123456,
  displayName = 'Medical Records Request',
  status = 'NEEDED_FROM_YOU',
  requestedDate = '2025-05-01',
  closedDate = null,
} = {}) => ({
  id,
  status,
  friendlyName: 'Medical records',
  displayName,
  suspenseDate: '2050-01-01',
  shortDescription: 'Please provide your medical records.',
  description: '',
  closedDate,
  date: null,
  documents: [],
  overdue: false,
  receivedDate: null,
  requestedDate,
  uploadsAllowed: true,
  canUploadFile: true,
  activityDescription: null,
  supportAliases: ['Medical Records Request'],
});

/**
 * Creates multiple tracked items for pagination testing
 *
 * @param {number} count - Number of tracked items to create
 * @param {Object} overrides - Properties to override defaults for each item
 * @returns {Array} Array of tracked item objects
 */
export const createMultipleTrackedItems = (count, overrides = {}) => {
  return Array.from({ length: count }, (_, i) =>
    createTrackedItem({
      id: i + 1,
      displayName: `Test request ${i + 1}`,
      ...overrides,
    }),
  );
};

/**
 * Creates a claim detail for /v0/benefits_claims/:id
 *
 * @param {Object} overrides - Properties to override defaults
 * @param {Array} overrides.contentions - List of claimed conditions
 * @param {string} overrides.status - Claim status
 * @param {string|null} overrides.closeDate - Claim close date
 * @param {Array} overrides.evidenceSubmissions - Evidence submissions array
 * @param {Array} overrides.trackedItems - Tracked items
 * @param {Array} overrides.supportingDocuments - Supporting documents (additional evidence)
 * @param {boolean} overrides.currentPhaseBack - Whether claim moved back to current phase
 * @param {boolean} overrides.decisionLetterSent - Whether decision letter was sent (for closed claims)
 * @param {Object} overrides.previousPhases - Previous phase completion dates (for Recent Activity)
 * @returns {Object} Claim detail object
 */
export const createBenefitsClaim = ({
  claimTypeCode = '010LCOMP',
  currentPhaseBack = false,
  decisionLetterSent = false,
  latestPhaseType = 'GATHERING_OF_EVIDENCE',
  closeDate = null,
  contentions = [
    { name: 'Asthma' },
    { name: 'Emphysema' },
    { name: 'Hearing Loss' },
    { name: 'Sleep Apnea' },
    { name: 'Tinnitus' },
  ],
  evidenceSubmissions = [],
  previousPhases = { phase1CompleteDate: '2025-01-02' },
  status = 'EVIDENCE_GATHERING_REVIEW_DECISION',
  supportingDocuments = [],
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
        previousPhases,
      },
      claimType: 'Compensation',
      closeDate,
      contentions,
      decisionLetterSent,
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
      supportingDocuments,
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
