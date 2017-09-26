import Raven from 'raven-js';

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
  GET_ADDRESS_FAILURE,
  GET_ADDRESS_SUCCESS,
  GET_BENEFIT_SUMMARY_OPTIONS_FAILURE,
  GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS,
  GET_LETTER_PDF_DOWNLOADING,
  GET_LETTER_PDF_SUCCESS,
  GET_LETTER_PDF_FAILURE,
  LETTER_ELIGIBILITY_ERROR,
  UPDATE_BENFIT_SUMMARY_REQUEST_OPTION,
  AVAILABILITY_STATUSES,
  DOWNLOAD_STATUSES,
  SAVE_ADDRESS_PENDING,
  SAVE_ADDRESS_SUCCESS,
  SAVE_ADDRESS_FAILURE,
  GET_ADDRESS_COUNTRIES_SUCCESS,
  GET_ADDRESS_COUNTRIES_FAILURE,
  GET_ADDRESS_STATES_SUCCESS,
  GET_ADDRESS_STATES_FAILURE
} from '../utils/constants';

const initialState = {
  countries: [],
  countriesAvailable: false,
  states: [],
  statesAvailable: false,
  letters: [],
  lettersAvailability: AVAILABILITY_STATUSES.awaitingResponse,
  letterDownloadStatus: {},
  fullName: {},
  address: {},
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
      _.forEach((letter) => {
        letterDownloadStatus[letter.letterType] = DOWNLOAD_STATUSES.pending;
      }, action.data.data.attributes.letters);

      return {
        ...state,
        letters: action.data.data.attributes.letters,
        fullName: action.data.data.attributes.fullName,
        lettersAvailability: AVAILABILITY_STATUSES.available,
        letterDownloadStatus
      };
    }
    case BACKEND_SERVICE_ERROR:
      return _.set('lettersAvailability', AVAILABILITY_STATUSES.backendServiceError, state);
    case BACKEND_AUTHENTICATION_ERROR:
      return _.set('lettersAvailability', AVAILABILITY_STATUSES.backendAuthenticationError, state);
    case INVALID_ADDRESS_PROPERTY:
      return _.set('lettersAvailability', AVAILABILITY_STATUSES.invalidAddressProperty, state);
    case GET_LETTERS_FAILURE:
      return _.set('lettersAvailability', AVAILABILITY_STATUSES.unavailable, state);
    case LETTER_ELIGIBILITY_ERROR:
      return _.set('lettersAvailability', AVAILABILITY_STATUSES.letterEligibilityError, state);
    case GET_ADDRESS_SUCCESS: {
      const { attributes } = action.data.data;
      return {
        ...state,
        address: attributes.address,
        canUpdate: attributes.controlInformation.canUpdate,
        addressAvailable: true
      };
    }
    case GET_ADDRESS_FAILURE:
      return _.set('addressAvailable', false, state);
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
    case GET_LETTER_PDF_DOWNLOADING:
      return _.set(['letterDownloadStatus', action.data], DOWNLOAD_STATUSES.downloading, state);
    case GET_LETTER_PDF_SUCCESS:
      return _.set(['letterDownloadStatus', action.data], DOWNLOAD_STATUSES.success, state);
    case GET_LETTER_PDF_FAILURE:
      return _.set(['letterDownloadStatus', action.data], DOWNLOAD_STATUSES.failure, state);
    case SAVE_ADDRESS_PENDING:
      return _.set('savePending', true, state);
    case SAVE_ADDRESS_SUCCESS: {
      const newState = Object.assign({}, state, { savePending: false });
      return _.set('address', action.address, newState);
    }
    case SAVE_ADDRESS_FAILURE:
      return { ...state, savePending: false, saveAddressError: true };
    case GET_ADDRESS_COUNTRIES_SUCCESS: {
      let countriesAvailable = true;
      const countryList = action.countries.data.attributes.countries;

      // Log error if the countries response is not what we expect
      if (!Array.isArray(countryList) || countryList.length === 0) {
        Raven.captureMessage(`vets_letters_unexpected_country_response: ${countryList}`);
        countriesAvailable = false;
      }

      return {
        ...state,
        countries: countryList,
        countriesAvailable
      };
    }
    case GET_ADDRESS_COUNTRIES_FAILURE:
      return _.set('countriesAvailable', false, state);
    case GET_ADDRESS_STATES_SUCCESS: {
      let statesAvailable = true;
      const stateList = action.states.data.attributes.states;

      // Log error if the states response is not what we expect
      if (!Array.isArray(stateList) || stateList.length === 0) {
        Raven.captureMessage(`vets_letters_unexpected_state_response: ${stateList}`);
        statesAvailable = false;
      }
      return {
        ...state,
        states: stateList,
        statesAvailable
      };
    }
    case GET_ADDRESS_STATES_FAILURE:
      return _.set('statesAvailable', false, state);
    default:
      return state;
  }
}

export default {
  letters
};
