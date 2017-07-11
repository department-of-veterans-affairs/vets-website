import _ from 'lodash/fp';
import {
  benefitOptionsMap,
  optionsToAlwaysDisplay
} from '../utils/helpers';

const initialState = {
  letters: [],
  destination: {},
  lettersAvailability: 'awaitingResponse',
  benefitInfo: {},
  serviceInfo: [],
  optionsAvailable: false,
  requestOptions: {}
};

function letters(state = initialState, action) {
  switch (action.type) {
    case 'GET_LETTERS_SUCCESS': {
      // Hard-code a few extra letters for usability testing purposes. Revert after testing.
      let letterList = action.data.data.attributes.letters;
      if (_.findIndex({ letterType: 'medicare_partd' }, letterList) < 0) {
        letterList = _.concat(letterList, [{
          name: 'Proof of Creditable Prescription Drug Coverage Letter',
          letterType: 'medicare_partd'
        }]
        );
      }
      if (_.findIndex({ letterType: 'minimum_essential_coverage' }, letterList) < 0) {
        letterList = _.concat(letterList, [{
          name: 'Proof of Minimum Essential Coverage Letter',
          letterType: 'minimum_essential_coverage'
        }]
        );
      }
      return {
        ...state,
        letters: letterList,
        destination: action.data.meta.address,
        lettersAvailability: 'available'
      };
    }
    case 'GET_LETTERS_FAILURE':
      return _.set('lettersAvailability', 'unavailable', state);
    case 'GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS': {
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
    case 'GET_BENEFIT_SUMMARY_OPTIONS_FAILURE':
      return _.set('optionsAvailable', false, state);
    case 'UPDATE_BENFIT_SUMMARY_REQUEST_OPTION':
      return _.set(['requestOptions', action.propertyPath], action.value, state);
    default:
      return state;
  }
}

export default {
  letters
};
