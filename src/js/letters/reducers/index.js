import _ from 'lodash/fp';
import {
  benefitOptionsMap,
  optionsToAlwaysDisplay
} from '../utils/helpers.jsx';
import {
  BACKEND_AUTHENTICATION_ERROR,
  BACKEND_SERVICE_ERROR,
  INVALID_ADDRESS_PROPERTY,
  GET_LETTERS_FAILURE,
  GET_LETTERS_SUCCESS,
  GET_BENEFIT_SUMMARY_OPTIONS_FAILURE,
  GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS,
  LETTER_ELIGIBILITY_ERROR,
  UPDATE_BENFIT_SUMMARY_REQUEST_OPTION,
  UPDATE_ADDRESS
} from '../utils/constants';

const initialState = {
  benefitInfo: {},
  destination: {},
  letters: [],
  lettersAvailability: 'awaitingResponse',
  letterDownloadStatus: {},
  optionsAvailable: false,
  requestOptions: {},
  serviceInfo: []
};

function letters(state = initialState, action) {
  switch (action.type) {
    case GET_LETTERS_SUCCESS: {
      const letterDownloadStatus = {};
      _.forEach((letter) => {
        letterDownloadStatus[letter.letterType] = 'pending';
      }, action.data.data.attributes.letters);

      return {
        ...state,
        letters: action.data.data.attributes.letters,
        destination: action.data.data.attributes.address,
        lettersAvailability: 'available',
        letterDownloadStatus
      };
    }
    case BACKEND_SERVICE_ERROR:
      return _.set('lettersAvailability', 'backendServiceError', state);
    case BACKEND_AUTHENTICATION_ERROR:
      return _.set('lettersAvailability', 'backendAuthenticationError', state);
    case INVALID_ADDRESS_PROPERTY:
      return _.set('lettersAvailability', 'invalidAddressProperty', state);
    case GET_LETTERS_FAILURE:
      return _.set('lettersAvailability', 'unavailable', state);
    case LETTER_ELIGIBILITY_ERROR:
      return _.set('lettersAvailability', 'letterEligibilityError', state);
    case GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS: {
    // Gather all possible displayed options that the user may toggle on/off.
      const benefitInfo = action.data.data.attributes.benefitInformation;
      const possibleOptions = [];
      Object.keys(benefitInfo).forEach(key => {
        if ((optionsToAlwaysDisplay.includes(key) || (benefitInfo[key] !== false)) &&
            !possibleOptions.includes[key]) {
          possibleOptions.push(key);
        }
      });

      // Initialize the benefit summary letter request body by mapping each
      // option in possibleOptions to its corresponding request option key.
      // Set all request body options to true so that on page load, all options
      // are checked.
      const requestOptions = { militaryService: true };
      _.forEach((option) => {
        requestOptions[benefitOptionsMap[option]] = true;
      }, possibleOptions);

      return {
        ...state,
        benefitInfo: action.data.data.attributes.benefitInformation,
        serviceInfo: action.data.data.attributes.militaryService,
        optionsAvailable: true,
        requestOptions
      };
    }
    case GET_BENEFIT_SUMMARY_OPTIONS_FAILURE:
      return _.set('optionsAvailable', false, state);
    case UPDATE_BENFIT_SUMMARY_REQUEST_OPTION:
      return _.set(['requestOptions', action.propertyPath], action.value, state);
    case 'GET_LETTER_PDF_DOWNLOADING':
      return _.set(['letterDownloadStatus', action.data], 'downloading', state);
    case 'GET_LETTER_PDF_SUCCESS':
      return _.set(['letterDownloadStatus', action.data], 'success', state);
    case 'GET_LETTER_PDF_FAILURE':
      return _.set(['letterDownloadStatus', action.data], 'failure', state);
    case UPDATE_ADDRESS:
      return _.set('destination', action.address, state);
    default:
      return state;
  }
}

export default {
  letters
};
