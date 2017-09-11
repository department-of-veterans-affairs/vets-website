// Action types
export const BACKEND_AUTHENTICATION_ERROR = 'BACKEND_AUTHENTICATION_ERROR'; // 403
export const BACKEND_SERVICE_ERROR = 'BACKEND_SERVICE_ERROR'; // 503 or 504
export const INVALID_ADDRESS_PROPERTY = 'INVALID_ADDRESS_PROPERTY'; // 422
export const GET_LETTERS_FAILURE = 'GET_LETTERS_FAILURE';
export const GET_LETTERS_SUCCESS = 'GET_LETTERS_SUCCESS';
export const GET_BENEFIT_SUMMARY_OPTIONS_FAILURE = 'GET_BENEFIT_SUMMARY_OPTIONS_FAILURE';
export const GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS = 'GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS';
export const GET_LETTER_PDF_DOWNLOADING = 'GET_LETTER_PDF_DOWNLOADING';
export const GET_LETTER_PDF_FAILURE = 'GET_LETTER_PDF_FAILURE';
export const GET_LETTER_PDF_SUCCESS = 'GET_LETTER_PDF_SUCCESS';
export const LETTER_ELIGIBILITY_ERROR = 'LETTER_ELIGIBILITY_ERROR';
export const UPDATE_BENFIT_SUMMARY_REQUEST_OPTION = 'UPDATE_BENFIT_SUMMARY_REQUEST_OPTION';
export const UPDATE_ADDRESS = 'UPDATE_ADDRESS';


export const AVAILABILITY_STATUSES = Object.freeze({
  awaitingResponse: 'awaitingResponse',
  available: 'available',
  backendServiceError: 'backendServiceError',
  backendAuthenticationError: 'backendAuthenticationError',
  invalidAddressProperty: 'invalidAddressProperty',
  unavailable: 'unavailable',
  letterEligibilityError: 'letterEligibilityError'
});

export const DOWNLOAD_STATUSES = Object.freeze({
  pending: 'pending',
  downloading: 'downloading',
  success: 'success',
  failure: 'failure'
});

export const LETTER_TYPES = Object.freeze({
  benefitSummary: 'benefit_summary',
  commissary: 'commissary',
  proofOfService: 'proof_of_service',
  medicarePartD: 'medicare_partd',
  minimumEssentialCoverage: 'minimum_essential_coverage',
  serviceVerification: 'service_verification',
  civilService: 'civil_service',
  benefitVerification: 'benefit_verification'
});

export const BENEFIT_OPTIONS = Object.freeze({
  awardEffectiveDate: 'awardEffectiveDate',
  monthlyAwardAmount: 'monthlyAwardAmount',
  serviceConnectedPercentage: 'serviceConnectedPercentage',

  hasNonServiceConnectedPension: 'hasNonServiceConnectedPension',
  hasServiceConnectedDisabilities: 'hasServiceConnectedDisabilities',
  hasSurvivorsIndemnityCompensationAward: 'hasSurvivorsIndemnityCompensationAward',
  hasSurvivorsPensionAward: 'hasSurvivorsPensionAward',
  hasAdaptedHousing: 'hasAdaptedHousing',
  hasChapter35Eligibility: 'hasChapter35Eligibility',
  hasDeathResultOfDisability: 'hasDeathResultOfDisability',
  hasIndividualUnemployabilityGranted: 'hasIndividualUnemployabilityGranted',
  hasSpecialMonthlyCompensation: 'hasSpecialMonthlyCompensation',
});
