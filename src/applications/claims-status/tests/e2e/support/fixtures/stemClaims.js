/**
 * Creates a STEM claim for /v0/education_benefits_claims/stem_claim_status
 *
 * @param {Object} overrides - Properties to override defaults
 * @param {string} overrides.id - Claim ID
 * @param {boolean} overrides.automatedDenial - Whether claim was automatically denied (determines if card displays)
 * @param {string} overrides.deniedAt - Date claim was denied ("Last updated on..." text)
 * @param {string} overrides.submittedAt - Date claim was submitted ("Received on..." text)
 * @param {Array} overrides.evidenceSubmissions - Evidence submissions for upload error alerts
 * @returns {Object} STEM claim object
 */
export const createStemClaim = ({
  id = '1234',
  automatedDenial = true,
  deniedAt = '2025-01-15T12:00:00.000Z',
  submittedAt = '2025-01-01T12:00:00.000Z',
  evidenceSubmissions = [],
}) => {
  return {
    id,
    type: 'education_benefits_claims',
    attributes: {
      confirmationNumber: `V-EBC-${id}`,
      // isEnrolledStem,
      // isPursuingTeachingCert,
      // benefitLeft,
      // remainingEntitlement,
      automatedDenial, // Determines if card displays
      deniedAt, // "Last updated on..." text
      submittedAt, // "Received on..." text
      evidenceSubmissions, // For upload error alerts
    },
  };
};
