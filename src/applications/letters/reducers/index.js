import vapService from '@@vap-svc/reducers';

import set from 'platform/utilities/data/set';
import {
  benefitOptionsMap,
  optionsToAlwaysDisplay,
} from '../utils/helpers.jsx';
import {
  AVAILABILITY_STATUSES,
  BACKEND_AUTHENTICATION_ERROR,
  BACKEND_SERVICE_ERROR,
  DOWNLOAD_STATUSES,
  GET_BENEFIT_SUMMARY_OPTIONS_FAILURE,
  GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS,
  GET_LETTERS_FAILURE,
  GET_LETTERS_SUCCESS,
  GET_LETTER_PDF_DOWNLOADING,
  GET_LETTER_PDF_SUCCESS,
  GET_LETTER_PDF_FAILURE,
  INVALID_ADDRESS_PROPERTY,
  LETTER_ELIGIBILITY_ERROR,
  REQUEST_OPTIONS,
  UPDATE_BENEFIT_SUMMARY_REQUEST_OPTION,
  LETTER_HAS_EMPTY_ADDRESS,
  GET_ENHANCED_LETTERS_DOWNLOADING,
  GET_ENHANCED_LETTERS_SUCCESS,
  GET_ENHANCED_LETTERS_FAILURE,
  GET_TSA_LETTER_ELIGIBILITY_ERROR,
  GET_TSA_LETTER_ELIGIBILITY_LOADING,
  GET_TSA_LETTER_ELIGIBILITY_SUCCESS,
} from '../utils/constants';

export const initialState = {
  letters: [],
  lettersAvailability: AVAILABILITY_STATUSES.awaitingResponse,
  letterDownloadStatus: {},
  fullName: '',
  addressAvailability: AVAILABILITY_STATUSES.awaitingResponse,
  optionsAvailable: false,
  requestOptions: {},
  serviceInfo: [],
  savePending: false,
  benefitInfo: {},
  enhancedLetters: [],
  enhancedLetterStatus: {},
  tsaLetterEligibility: {},
};

function letters(state = initialState, action) {
  switch (action.type) {
    case GET_LETTERS_SUCCESS: {
      const letterDownloadStatus = {};
      action.data.letters.forEach(letter => {
        letterDownloadStatus[letter.letterType] = DOWNLOAD_STATUSES.pending;
      });

      return {
        ...state,
        letters: action.data.letters,
        fullName: action.data.fullName,
        lettersAvailability: AVAILABILITY_STATUSES.available,
        letterDownloadStatus,
      };
    }
    case BACKEND_SERVICE_ERROR:
      return set(
        'lettersAvailability',
        AVAILABILITY_STATUSES.backendServiceError,
        state,
      );
    case BACKEND_AUTHENTICATION_ERROR:
      return set(
        'lettersAvailability',
        AVAILABILITY_STATUSES.backendAuthenticationError,
        state,
      );
    case INVALID_ADDRESS_PROPERTY:
      return set(
        'lettersAvailability',
        AVAILABILITY_STATUSES.invalidAddressProperty,
        state,
      );
    case GET_LETTERS_FAILURE:
      return set(
        'lettersAvailability',
        AVAILABILITY_STATUSES.unavailable,
        state,
      );
    case LETTER_ELIGIBILITY_ERROR:
      return set(
        'lettersAvailability',
        AVAILABILITY_STATUSES.letterEligibilityError,
        state,
      );
    case GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS: {
      // Gather all possible displayed options that the user may toggle on/off.
      const benefitInfo = action.data.benefitInformation;
      const possibleOptions = [];
      Object.keys(benefitInfo).forEach(key => {
        if (
          // the option should always be displayed or vets-api says it is available
          (optionsToAlwaysDisplay.includes(key) ||
            benefitInfo[key] !== false) &&
          // and the option is not yet in the possibleOptions array
          !possibleOptions.includes[key] &&
          // and the option is a customization option that vets-api supports
          REQUEST_OPTIONS[key]
        ) {
          possibleOptions.push(key);
        }
      });

      // Initialize the benefit summary letter request body by mapping each
      // option in possibleOptions to its corresponding request option key.
      // Set all request body options to true so that on page load, all options
      // are checked.
      const requestOptions = { militaryService: true };
      possibleOptions.forEach(option => {
        requestOptions[benefitOptionsMap[option]] = true;
      });

      return {
        ...state,
        benefitInfo: action.data.benefitInformation,
        serviceInfo: action.data.militaryService,
        optionsAvailable: true,
        requestOptions,
      };
    }
    case GET_BENEFIT_SUMMARY_OPTIONS_FAILURE:
      return set('optionsAvailable', false, state);
    case UPDATE_BENEFIT_SUMMARY_REQUEST_OPTION:
      return set(['requestOptions', action.propertyPath], action.value, state);
    case GET_LETTER_PDF_DOWNLOADING:
      return set(
        ['letterDownloadStatus', action.data],
        DOWNLOAD_STATUSES.downloading,
        state,
      );
    case GET_LETTER_PDF_SUCCESS:
      return set(
        ['letterDownloadStatus', action.data],
        DOWNLOAD_STATUSES.success,
        state,
      );
    case GET_LETTER_PDF_FAILURE:
      return set(
        ['letterDownloadStatus', action.data],
        DOWNLOAD_STATUSES.failure,
        state,
      );
    case LETTER_HAS_EMPTY_ADDRESS:
      return {
        ...state,
        lettersAvailability: AVAILABILITY_STATUSES.hasEmptyAddress,
        addressAvailability: AVAILABILITY_STATUSES.hasEmptyAddress,
      };
    case GET_ENHANCED_LETTERS_DOWNLOADING: {
      return {
        ...state,
        enhancedLetterStatus: {
          ...state.enhancedLetterStatus,
          [action.letterType]: DOWNLOAD_STATUSES.downloading,
        },
      };
    }
    case GET_ENHANCED_LETTERS_SUCCESS: {
      const newStatus = {};
      action.data.forEach(letter => {
        newStatus[letter.letterType] = DOWNLOAD_STATUSES.success;
      });

      return {
        ...state,
        enhancedLetters: action.data,
        enhancedLetterStatus: {
          ...state.enhancedLetterStatus,
          ...newStatus,
        },
      };
    }
    case GET_ENHANCED_LETTERS_FAILURE: {
      return {
        ...state,
        enhancedLetterStatus: {
          ...state.enhancedLetterStatus,
          [action.letterType]: DOWNLOAD_STATUSES.failure,
        },
      };
    }
    case GET_TSA_LETTER_ELIGIBILITY_ERROR: {
      return {
        ...state,
        tsaLetterEligibility: {
          error: true,
          loading: false,
        },
      };
    }
    case GET_TSA_LETTER_ELIGIBILITY_LOADING: {
      return {
        ...state,
        tsaLetterEligibility: {
          error: false,
          loading: true,
        },
      };
    }
    case GET_TSA_LETTER_ELIGIBILITY_SUCCESS: {
      return {
        ...state,
        tsaLetterEligibility: {
          documentId: action.data?.attributes?.documentId,
          error: false,
          loading: false,
        },
      };
    }
    default:
      return state;
  }
}

export default {
  letters,
  vapService,
};
