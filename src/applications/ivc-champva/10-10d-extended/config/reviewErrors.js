import numberToWords from 'platform/forms-system/src/js/utilities/data/numberToWords';

/**
 * Link text for review & submit page errors
 * key = "name" from `form.formErrors.errors`
 * @see src/platform/forms-system/docs/reviewErrors.md
 */

/**
 * Helper to generate ordinal text for array items
 * @param {number} index - zero-based index
 * @returns {string} - ordinal text like "first", "second", etc.
 */
const ordinal = index => numberToWords(index + 1);

const reviewErrors = {
  // ===== Certifier Information =====
  certifierRole: 'Your information (select which best describes you)',

  // Certifier name fields
  first: 'Your name (enter your first name)',
  last: 'Your name (enter your last name)',

  // Certifier address fields
  country: 'Your mailing address (select a country)',
  street: 'Your mailing address (enter a street address)',
  city: 'Your mailing address (enter a city)',
  state: 'Your mailing address (select a state)',
  postalCode: 'Your mailing address (enter a postal code)',

  // Certifier contact info
  certifierPhone: 'Your contact information (enter a phone number)',
  certifierEmail: 'Your contact information (enter an email address)',

  // Certifier relationship
  relationshipToVeteran:
    'Your relationship to the applicant (select at least one option)',
  otherRelationshipToVeteran:
    'Your relationship to the applicant (describe your relationship)',

  // ===== Sponsor Information =====
  sponsorDob: "Veteran's date of birth (enter a valid date)",
  sponsorSsn: "Veteran's identification (enter a valid Social Security number)",
  sponsorIsDeceased: "Veteran's status (select yes or no)",
  sponsorDOD: "Veteran's date of death (enter a valid date)",
  sponsorDeathConditions:
    "Veteran's death conditions (select whether they died during active service)",
  sponsorPhone: "Veteran's contact information (enter a phone number)",

  // ===== Applicant Information (array) =====
  // These use functions to include the ordinal position
  // Some errors come through as just the field name, others as dot-notation path
  applicantSsn: index =>
    `${ordinal(
      index,
    )} applicant's identification (enter a valid Social Security number)`,
  'applicants.applicantSsn': index =>
    `${ordinal(
      index,
    )} applicant's identification (enter a valid Social Security number)`,
  applicantPhone: index =>
    `${ordinal(index)} applicant's contact information (enter a phone number)`,
  'applicants.applicantPhone': index =>
    `${ordinal(index)} applicant's contact information (enter a phone number)`,
  applicantGender: index =>
    `${ordinal(index)} applicant's sex listed at birth (select an option)`,
  'applicants.applicantGender': index =>
    `${ordinal(index)} applicant's sex listed at birth (select an option)`,
  applicantRelationshipToSponsor: index =>
    `${ordinal(
      index,
    )} applicant's relationship to Veteran (select a relationship)`,
  'applicants.applicantRelationshipToSponsor': index =>
    `${ordinal(
      index,
    )} applicant's relationship to Veteran (select a relationship)`,
  applicantRelationshipOrigin: index =>
    `${ordinal(
      index,
    )} applicant's dependent status (select how they became a dependent)`,
  'applicants.applicantRelationshipOrigin': index =>
    `${ordinal(
      index,
    )} applicant's dependent status (select how they became a dependent)`,
  applicantDependentStatus: index =>
    `${ordinal(index)} applicant's dependent status (select current status)`,
  'applicants.applicantDependentStatus': index =>
    `${ordinal(index)} applicant's dependent status (select current status)`,
  applicantRemarried: index =>
    `${ordinal(index)} applicant's marriage status (select yes or no)`,
  'applicants.applicantRemarried': index =>
    `${ordinal(index)} applicant's marriage status (select yes or no)`,
  dateOfMarriageToSponsor: index =>
    `${ordinal(index)} applicant's marriage date (enter a valid date)`,
  'applicants.dateOfMarriageToSponsor': index =>
    `${ordinal(index)} applicant's marriage date (enter a valid date)`,

  // Applicant file uploads
  applicantBirthCertOrSocialSecCard: index =>
    `${ordinal(index)} applicant's birth certificate (upload a document)`,
  'applicants.applicantBirthCertOrSocialSecCard': index =>
    `${ordinal(index)} applicant's birth certificate (upload a document)`,
  applicantAdoptionPapers: index =>
    `${ordinal(index)} applicant's adoption documents (upload a document)`,
  'applicants.applicantAdoptionPapers': index =>
    `${ordinal(index)} applicant's adoption documents (upload a document)`,
  applicantStepMarriageCert: index =>
    `${ordinal(
      index,
    )} applicant's proof of parent's marriage (upload a document)`,
  'applicants.applicantStepMarriageCert': index =>
    `${ordinal(
      index,
    )} applicant's proof of parent's marriage (upload a document)`,
  applicantSchoolCert: index =>
    `${ordinal(index)} applicant's school enrollment proof (upload a document)`,
  'applicants.applicantSchoolCert': index =>
    `${ordinal(index)} applicant's school enrollment proof (upload a document)`,
  applicantRemarriageCert: index =>
    `${ordinal(index)} applicant's proof of remarriage (upload a document)`,
  'applicants.applicantRemarriageCert': index =>
    `${ordinal(index)} applicant's proof of remarriage (upload a document)`,

  // ===== Medicare Information (array) =====
  medicareParticipant: index =>
    `${ordinal(index)} Medicare plan (select an applicant)`,
  medicarePlanType: index =>
    `${ordinal(index)} Medicare plan (select a plan type)`,
  medicareNumber: index =>
    `${ordinal(
      index,
    )} Medicare plan (enter the Medicare beneficiary identifier)`,
  hasMedicarePartD: index =>
    `${ordinal(index)} Medicare plan Part D status (select yes or no)`,
  medicarePartAEffectiveDate: index =>
    `${ordinal(
      index,
    )} Medicare plan Part A effective date (enter a valid date)`,
  medicarePartBEffectiveDate: index =>
    `${ordinal(
      index,
    )} Medicare plan Part B effective date (enter a valid date)`,
  medicarePartCCarrier: index =>
    `${ordinal(index)} Medicare plan Part C carrier (enter the carrier name)`,
  medicarePartCEffectiveDate: index =>
    `${ordinal(
      index,
    )} Medicare plan Part C effective date (enter a valid date)`,
  hasPharmacyBenefits: index =>
    `${ordinal(
      index,
    )} Medicare plan Part C pharmacy benefits (select yes or no)`,
  medicarePartDEffectiveDate: index =>
    `${ordinal(
      index,
    )} Medicare plan Part D effective date (enter a valid date)`,

  // Medicare file uploads
  medicarePartAFrontCard: index =>
    `${ordinal(index)} Medicare plan Part A card (upload front of card)`,
  medicarePartABackCard: index =>
    `${ordinal(index)} Medicare plan Part A card (upload back of card)`,
  medicarePartBFrontCard: index =>
    `${ordinal(index)} Medicare plan Part B card (upload front of card)`,
  medicarePartBBackCard: index =>
    `${ordinal(index)} Medicare plan Part B card (upload back of card)`,
  medicarePartAPartBFrontCard: index =>
    `${ordinal(index)} Medicare plan card (upload front of card)`,
  medicarePartAPartBBackCard: index =>
    `${ordinal(index)} Medicare plan card (upload back of card)`,
  medicarePartCFrontCard: index =>
    `${ordinal(index)} Medicare plan Part C card (upload front of card)`,
  medicarePartCBackCard: index =>
    `${ordinal(index)} Medicare plan Part C card (upload back of card)`,
  medicarePartDFrontCard: index =>
    `${ordinal(index)} Medicare plan Part D card (upload front of card)`,
  medicarePartDBackCard: index =>
    `${ordinal(index)} Medicare plan Part D card (upload back of card)`,
  medicarePartADenialProof: index =>
    `${ordinal(
      index,
    )} Medicare plan proof of ineligibility (upload a document)`,

  // ===== Health Insurance Information (array) =====
  healthcareParticipants: index =>
    `${ordinal(index)} health insurance plan (select at least one participant)`,
  insuranceType: index =>
    `${ordinal(index)} health insurance plan (select a plan type)`,
  medigapPlan: index =>
    `${ordinal(index)} health insurance plan (select the Medigap policy)`,
  provider: index =>
    `${ordinal(index)} health insurance plan (enter the provider name)`,
  effectiveDate: index =>
    `${ordinal(index)} health insurance plan (enter the start date)`,
  throughEmployer: index =>
    `${ordinal(
      index,
    )} health insurance plan (select whether it's through an employer)`,
  eob: index =>
    `${ordinal(
      index,
    )} health insurance plan (select whether it covers prescriptions)`,
  insuranceCardFront: index =>
    `${ordinal(index)} health insurance card (upload front of card)`,
  insuranceCardBack: index =>
    `${ordinal(index)} health insurance card (upload back of card)`,

  /**
   * Override function to route errors to the correct chapter/page
   * @param {string} error - The error path string
   * @param {object} fullError - The full error object
   * @returns {object|null} - Object with chapterKey and pageKey, or null
   */
  _override: error => {
    if (typeof error !== 'string') {
      return null;
    }

    // --- Certifier Information ---
    if (error === 'certifierRole') {
      return { chapterKey: 'certifierInformation', pageKey: 'page1' };
    }
    if (
      error.includes('certifierName') ||
      (error === 'first' && !error.includes('applicant')) ||
      (error === 'last' && !error.includes('applicant'))
    ) {
      return { chapterKey: 'certifierInformation', pageKey: 'page2' };
    }
    if (
      error.includes('certifierAddress') ||
      error === 'country' ||
      error === 'street' ||
      error === 'city' ||
      error === 'state' ||
      error === 'postalCode'
    ) {
      return { chapterKey: 'certifierInformation', pageKey: 'page3' };
    }
    if (error === 'certifierPhone' || error === 'certifierEmail') {
      return { chapterKey: 'certifierInformation', pageKey: 'page4' };
    }
    if (
      error.includes('certifierRelationship') ||
      error === 'relationshipToVeteran' ||
      error === 'otherRelationshipToVeteran'
    ) {
      return { chapterKey: 'certifierInformation', pageKey: 'page5' };
    }

    // --- Sponsor Information ---
    if (error.includes('sponsorName') || error === 'sponsorDob') {
      return { chapterKey: 'sponsorInformation', pageKey: 'page6' };
    }
    if (error === 'sponsorSsn') {
      return { chapterKey: 'sponsorInformation', pageKey: 'page7' };
    }
    if (error === 'sponsorIsDeceased') {
      return { chapterKey: 'sponsorInformation', pageKey: 'page8' };
    }
    if (error === 'sponsorDOD' || error === 'sponsorDeathConditions') {
      return { chapterKey: 'sponsorInformation', pageKey: 'page9' };
    }
    if (error.includes('sponsorAddress')) {
      return { chapterKey: 'sponsorInformation', pageKey: 'page10' };
    }
    if (error === 'sponsorPhone' || error === 'sponsorEmail') {
      return { chapterKey: 'sponsorInformation', pageKey: 'page11' };
    }

    // --- Applicant Information (array) ---
    if (/applicants\[\d+\]/.test(error)) {
      if (error.includes('applicantName') || error.includes('applicantDob')) {
        return { chapterKey: 'applicantInformation', pageKey: 'page13' };
      }
      if (error.includes('applicantSsn')) {
        return { chapterKey: 'applicantInformation', pageKey: 'page14' };
      }
      if (error.includes('applicantAddress')) {
        return { chapterKey: 'applicantInformation', pageKey: 'page15' };
      }
      if (
        error.includes('applicantPhone') ||
        error.includes('applicantEmailAddress')
      ) {
        return { chapterKey: 'applicantInformation', pageKey: 'page16' };
      }
      if (error.includes('applicantGender')) {
        return { chapterKey: 'applicantInformation', pageKey: 'page17' };
      }
      if (error.includes('applicantRelationshipToSponsor')) {
        return { chapterKey: 'applicantInformation', pageKey: 'page18' };
      }
      if (error.includes('applicantRelationshipOrigin')) {
        return { chapterKey: 'applicantInformation', pageKey: 'page18c' };
      }
      if (error.includes('applicantDependentStatus')) {
        return { chapterKey: 'applicantInformation', pageKey: 'page18b1' };
      }
      if (error.includes('applicantBirthCertOrSocialSecCard')) {
        return { chapterKey: 'applicantInformation', pageKey: 'page18a' };
      }
      if (error.includes('applicantAdoptionPapers')) {
        return { chapterKey: 'applicantInformation', pageKey: 'page18d' };
      }
      if (error.includes('applicantStepMarriageCert')) {
        return { chapterKey: 'applicantInformation', pageKey: 'page18e' };
      }
      if (error.includes('applicantSchoolCert')) {
        return { chapterKey: 'applicantInformation', pageKey: 'page18b' };
      }
      if (error.includes('dateOfMarriageToSponsor')) {
        return { chapterKey: 'applicantInformation', pageKey: 'page18f3' };
      }
      if (error.includes('applicantRemarried')) {
        return { chapterKey: 'applicantInformation', pageKey: 'page18f4' };
      }
      if (error.includes('applicantRemarriageCert')) {
        return { chapterKey: 'applicantInformation', pageKey: 'page18g' };
      }
    }

    // --- Medicare Information (array) ---
    if (/medicare\[\d+\]/.test(error)) {
      if (error.includes('medicareParticipant')) {
        return { chapterKey: 'medicareInformation', pageKey: 'participant' };
      }
      if (error.includes('medicarePlanType')) {
        return {
          chapterKey: 'medicareInformation',
          pageKey: 'medicarePlanType',
        };
      }
      if (error.includes('medicareNumber')) {
        return {
          chapterKey: 'medicareInformation',
          pageKey: 'medicareBeneficiaryIdentifier',
        };
      }
      if (error.includes('medicarePartAEffectiveDate')) {
        return {
          chapterKey: 'medicareInformation',
          pageKey: 'medicarePartAEffectiveDate',
        };
      }
      if (
        error.includes('medicarePartAFrontCard') ||
        error.includes('medicarePartABackCard')
      ) {
        return {
          chapterKey: 'medicareInformation',
          pageKey: 'medicarePartACardUpload',
        };
      }
      if (error.includes('medicarePartBEffectiveDate')) {
        return {
          chapterKey: 'medicareInformation',
          pageKey: 'medicarePartBEffectiveDate',
        };
      }
      if (
        error.includes('medicarePartBFrontCard') ||
        error.includes('medicarePartBBackCard')
      ) {
        return {
          chapterKey: 'medicareInformation',
          pageKey: 'medicarePartBCardUpload',
        };
      }
      if (
        error.includes('medicarePartAPartBFrontCard') ||
        error.includes('medicarePartAPartBBackCard')
      ) {
        return {
          chapterKey: 'medicareInformation',
          pageKey: 'medicareABCardUpload',
        };
      }
      if (
        error.includes('medicarePartCCarrier') ||
        error.includes('medicarePartCEffectiveDate')
      ) {
        return {
          chapterKey: 'medicareInformation',
          pageKey: 'medicarePartCCarrierEffectiveDate',
        };
      }
      if (error.includes('hasPharmacyBenefits')) {
        return {
          chapterKey: 'medicareInformation',
          pageKey: 'medicarePartCPharmacyBenefits',
        };
      }
      if (
        error.includes('medicarePartCFrontCard') ||
        error.includes('medicarePartCBackCard')
      ) {
        return {
          chapterKey: 'medicareInformation',
          pageKey: 'medicarePartCCardUpload',
        };
      }
      if (error.includes('hasMedicarePartD')) {
        return {
          chapterKey: 'medicareInformation',
          pageKey: 'medicarePartDStatus',
        };
      }
      if (error.includes('medicarePartDEffectiveDate')) {
        return {
          chapterKey: 'medicareInformation',
          pageKey: 'medicarePartDCarrierEffectiveDate',
        };
      }
      if (
        error.includes('medicarePartDFrontCard') ||
        error.includes('medicarePartDBackCard')
      ) {
        return {
          chapterKey: 'medicareInformation',
          pageKey: 'medicarePartDCardUpload',
        };
      }
      if (error.includes('medicarePartADenialProof')) {
        return {
          chapterKey: 'medicareInformation',
          pageKey: 'medicarePartADenialProofUpload',
        };
      }
    }

    // --- Health Insurance Information (array) ---
    if (/healthInsurance\[\d+\]/.test(error)) {
      if (error.includes('insuranceType')) {
        return {
          chapterKey: 'healthInsuranceInformation',
          pageKey: 'healthInsuranceType',
        };
      }
      if (error.includes('medigapPlan')) {
        return {
          chapterKey: 'healthInsuranceInformation',
          pageKey: 'medigapType',
        };
      }
      if (error.includes('provider') || error.includes('effectiveDate')) {
        return {
          chapterKey: 'healthInsuranceInformation',
          pageKey: 'provider',
        };
      }
      if (error.includes('throughEmployer')) {
        return {
          chapterKey: 'healthInsuranceInformation',
          pageKey: 'throughEmployer',
        };
      }
      if (error.includes('eob')) {
        return {
          chapterKey: 'healthInsuranceInformation',
          pageKey: 'prescriptionCoverage',
        };
      }
      if (error.includes('healthcareParticipants')) {
        return {
          chapterKey: 'healthInsuranceInformation',
          pageKey: 'participants',
        };
      }
      if (
        error.includes('insuranceCardFront') ||
        error.includes('insuranceCardBack')
      ) {
        return {
          chapterKey: 'healthInsuranceInformation',
          pageKey: 'insuranceCard',
        };
      }
    }

    // Always return null for non-matches
    return null;
  },
};

export default reviewErrors;
