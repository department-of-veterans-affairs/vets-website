import vet360 from 'vet360/reducers';

import _ from 'lodash/fp';
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
};

function letters(state = initialState, action) {
  switch (action.type) {
    case GET_LETTERS_SUCCESS: {
      const letterDownloadStatus = {};
      _.forEach(letter => {
        letterDownloadStatus[letter.letterType] = DOWNLOAD_STATUSES.pending;
      }, action.data.data.attributes.letters);

      return {
        ...state,
        letters: action.data.data.attributes.letters,
        fullName: action.data.data.attributes.fullName,
        lettersAvailability: AVAILABILITY_STATUSES.available,
        letterDownloadStatus,
      };
    }
    case BACKEND_SERVICE_ERROR:
      return _.set(
        'lettersAvailability',
        AVAILABILITY_STATUSES.backendServiceError,
        state,
      );
    case BACKEND_AUTHENTICATION_ERROR:
      return _.set(
        'lettersAvailability',
        AVAILABILITY_STATUSES.backendAuthenticationError,
        state,
      );
    case INVALID_ADDRESS_PROPERTY:
      return _.set(
        'lettersAvailability',
        AVAILABILITY_STATUSES.invalidAddressProperty,
        state,
      );
    case GET_LETTERS_FAILURE:
      return _.set(
        'lettersAvailability',
        AVAILABILITY_STATUSES.unavailable,
        state,
      );
    case LETTER_ELIGIBILITY_ERROR:
      return _.set(
        'lettersAvailability',
        AVAILABILITY_STATUSES.letterEligibilityError,
        state,
      );
    case GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS: {
      // Gather all possible displayed options that the user may toggle on/off.
      const benefitInfo = action.data.data.attributes.benefitInformation;
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
      _.forEach(option => {
        requestOptions[benefitOptionsMap[option]] = true;
      }, possibleOptions);

      return {
        ...state,
        benefitInfo: action.data.data.attributes.benefitInformation,
        serviceInfo: action.data.data.attributes.militaryService,
        optionsAvailable: true,
        requestOptions,
      };
    }
    case GET_BENEFIT_SUMMARY_OPTIONS_FAILURE:
      return _.set('optionsAvailable', false, state);
    case UPDATE_BENEFIT_SUMMARY_REQUEST_OPTION:
      return _.set(
        ['requestOptions', action.propertyPath],
        action.value,
        state,
      );
    case GET_LETTER_PDF_DOWNLOADING:
      return _.set(
        ['letterDownloadStatus', action.data],
        DOWNLOAD_STATUSES.downloading,
        state,
      );
    case GET_LETTER_PDF_SUCCESS:
      return _.set(
        ['letterDownloadStatus', action.data],
        DOWNLOAD_STATUSES.success,
        state,
      );
    case GET_LETTER_PDF_FAILURE:
      return _.set(
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
    default:
      return state;
  }
}

export default {
  letters,
  vet360,
};
