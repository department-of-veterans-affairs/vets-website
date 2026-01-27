// Action types
// getLetterList() actions
export const BACKEND_AUTHENTICATION_ERROR = 'BACKEND_AUTHENTICATION_ERROR'; // 403
export const BACKEND_SERVICE_ERROR = 'BACKEND_SERVICE_ERROR'; // 503 or 504
export const GET_LETTERS_FAILURE = 'GET_LETTERS_FAILURE';
export const GET_LETTERS_SUCCESS = 'GET_LETTERS_SUCCESS';
export const INVALID_ADDRESS_PROPERTY = 'INVALID_ADDRESS_PROPERTY'; // 422
export const LETTER_ELIGIBILITY_ERROR = 'LETTER_ELIGIBILITY_ERROR'; // 502
export const LETTER_HAS_EMPTY_ADDRESS = 'LETTER_HAS_EMPTY_ADDRESS';

// getLettersPdfLinks() actions
export const GET_ENHANCED_LETTERS_DOWNLOADING =
  'GET_ENHANCED_LETTERS_DOWNLOADING';
export const GET_ENHANCED_LETTERS_SUCCESS = 'GET_ENHANCED_LETTERS_SUCCESS';
export const GET_ENHANCED_LETTERS_FAILURE = 'GET_ENHANCED_LETTERS_FAILURE';

// getBenefitSummaryOptions() actions
export const GET_BENEFIT_SUMMARY_OPTIONS_FAILURE =
  'GET_BENEFIT_SUMMARY_OPTIONS_FAILURE';
export const GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS =
  'GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS';

// getLetterPdf() actions
export const GET_LETTER_PDF_DOWNLOADING = 'GET_LETTER_PDF_DOWNLOADING';
export const GET_LETTER_PDF_FAILURE = 'GET_LETTER_PDF_FAILURE';
export const GET_LETTER_PDF_SUCCESS = 'GET_LETTER_PDF_SUCCESS';

export const GET_TSA_LETTER_ELIGIBILITY_ERROR =
  'GET_TSA_LETTER_ELIGIBILITY_ERROR';
export const GET_TSA_LETTER_ELIGIBILITY_LOADING =
  'GET_TSA_LETTER_ELIGIBILITY_LOADING';
export const GET_TSA_LETTER_ELIGIBILITY_SUCCESS =
  'GET_TSA_LETTER_ELIGIBILITY_SUCCESS';

// updateBenefitSummaryRequestOption() actions
export const UPDATE_BENEFIT_SUMMARY_REQUEST_OPTION =
  'UPDATE_BENEFIT_SUMMARY_REQUEST_OPTION';

export const AVAILABILITY_STATUSES = Object.freeze({
  awaitingResponse: 'awaitingResponse',
  available: 'available',
  backendServiceError: 'backendServiceError',
  backendAuthenticationError: 'backendAuthenticationError',
  invalidAddressProperty: 'invalidAddressProperty',
  unavailable: 'unavailable',
  letterEligibilityError: 'letterEligibilityError',
  hasEmptyAddress: 'hasEmptyAddress',
});

export const DOWNLOAD_STATUSES = Object.freeze({
  notStarted: 'not started',
  pending: 'pending',
  downloading: 'downloading',
  success: 'success',
  failure: 'failure',
});

// if you update LETTER_TYPES, update LETTER_TYPES in vets-api lib/evss/letters/letter.rb
export const LETTER_TYPES = Object.freeze({
  benefitSummary: 'benefit_summary',
  benefitSummaryDependent: 'benefit_summary_dependent',
  benefitVerification: 'benefit_verification',
  certificateOfEligibility: 'certificate_of_eligibility',
  civilService: 'civil_service',
  commissary: 'commissary',
  foreignMedicalProgram: 'foreign_medical_program',
  medicarePartD: 'medicare_partd',
  minimumEssentialCoverage: 'minimum_essential_coverage',
  proofOfService: 'proof_of_service',
  serviceVerification: 'service_verification',
});

// Benefit options returned from vets-api, used in UI
export const BENEFIT_OPTIONS = Object.freeze({
  awardEffectiveDate: 'awardEffectiveDate',
  monthlyAwardAmount: 'monthlyAwardAmount',
  serviceConnectedPercentage: 'serviceConnectedPercentage',

  hasNonServiceConnectedPension: 'hasNonServiceConnectedPension',
  hasServiceConnectedDisabilities: 'hasServiceConnectedDisabilities',
  hasSurvivorsIndemnityCompensationAward:
    'hasSurvivorsIndemnityCompensationAward',
  hasSurvivorsPensionAward: 'hasSurvivorsPensionAward',
  hasAdaptedHousing: 'hasAdaptedHousing',
  hasChapter35Eligibility: 'hasChapter35Eligibility',
  hasDeathResultOfDisability: 'hasDeathResultOfDisability',
  hasIndividualUnemployabilityGranted: 'hasIndividualUnemployabilityGranted',
  hasSpecialMonthlyCompensation: 'hasSpecialMonthlyCompensation',
});

// Benefit Summary Letter request customization options, subset of BENEFIT_OPTIONS
// Currently only key removed is awardEffectiveDate
export const REQUEST_OPTIONS = Object.freeze({
  monthlyAwardAmount: 'monthlyAwardAmount',
  serviceConnectedPercentage: 'serviceConnectedPercentage',
  hasNonServiceConnectedPension: 'hasNonServiceConnectedPension',
  hasServiceConnectedDisabilities: 'hasServiceConnectedDisabilities',
  hasSurvivorsIndemnityCompensationAward:
    'hasSurvivorsIndemnityCompensationAward',
  hasSurvivorsPensionAward: 'hasSurvivorsPensionAward',
  hasAdaptedHousing: 'hasAdaptedHousing',
  hasChapter35Eligibility: 'hasChapter35Eligibility',
  hasDeathResultOfDisability: 'hasDeathResultOfDisability',
  hasIndividualUnemployabilityGranted: 'hasIndividualUnemployabilityGranted',
  hasSpecialMonthlyCompensation: 'hasSpecialMonthlyCompensation',
});

import ADDRESS_DATA from 'platform/forms/address/data';

export const STATE_CODE_TO_NAME = ADDRESS_DATA.states;

export const GET_TSA_LETTER_ELIGIBILITY_ENDPOINT = '/v0/tsa_letter';
export const DOWNLOAD_TSA_LETTER_ENDPOINT = id => `/v0/tsa_letter/${id}`;
